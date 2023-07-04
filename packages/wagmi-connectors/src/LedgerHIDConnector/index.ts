import { ChainNotConfiguredForConnectorError, normalizeChainId } from '@wagmi/connectors'
import invariant from 'tiny-invariant'
import {
  Account,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  getAddress,
  numberToHex
} from 'viem'
import { Address, Connector, ConnectorData, ConnectorNotFoundError, WalletClient, mainnet } from 'wagmi'

import { checkError, isHIDSupported } from './helpers'
import type { LedgerHQProvider } from './provider'
import { ConnectorUpdate } from './types'

export { checkError, isHIDSupported }

type LedgerHidOptions = { url: string; shimDisconnect?: boolean; onDeviceDisconnect?: () => Promise<void> }
export class LedgerHIDConnector extends Connector<LedgerHQProvider, LedgerHidOptions> {
  public provider?: LedgerHQProvider
  public url: string
  public chainId: number

  ready: boolean

  id = 'ledger-hid'
  name = 'Ledger HID'

  protected shimDisconnectKey = `${this.id}.shimDisconnect`

  // Ledger only accepts mainnet so these constuctor props are useless
  constructor(/* props: { chains: Chain[]; options: LedgerHidOptions } */) {
    super({ chains: [mainnet], options: { url: mainnet.rpcUrls.default.http[0] } })

    // Ledger only accepts 1 (mainnet ethereum) for now
    this.chainId = mainnet.id
    this.url = mainnet.rpcUrls.default.http[0]

    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.ready = true
  }

  async connect({ chainId }: { chainId?: number } = {}): Promise<Required<ConnectorData>> {
    try {
      const { account, provider } = await this.activate()

      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      // Add shim to storage signalling wallet is connected
      if (this.options.shimDisconnect) this.storage?.setItem(this.shimDisconnectKey, true)

      return { account: account as Address, chain: { id, unsupported } }
    } catch (error) {
      if ((error as any)?.statusCode === 27906) {
        throw new Error('Ledger locked! Please unlock and make sure your Ethereum app is open.')
      }
      throw error
    }
  }

  // Wagmi disconnect
  async disconnect() {
    invariant(this.provider, 'Provider not available')

    this.provider.removeListener('accountsChanged', this.onAccountsChanged)
    this.provider.removeListener('chainChanged', this.onChainChanged)
    this.provider.removeListener('disconnect', this.onDisconnect)

    // Remove shim signalling wallet is disconnected
    if (this.options.shimDisconnect) this.storage?.removeItem(this.shimDisconnectKey)
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()])
    const chain = this.chains.find((x) => x.id === chainId)
    if (!provider) throw new Error('provider is required.')
    return createWalletClient({
      account: account as Account | `0x${string}` | undefined,
      chain,
      transport: custom(provider)
    })
  }

  async isAuthorized() {
    try {
      if (
        this.options.shimDisconnect &&
        // If shim does not exist in storage, wallet is disconnected
        !this.storage?.getItem(this.shimDisconnectKey)
      )
        return false

      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const id = numberToHex(chainId)

    try {
      await Promise.all([
        provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }]
        }),
        new Promise<void>((res) =>
          this.on('change', ({ chain }) => {
            if (chain?.id === chainId) res()
          })
        )
      ])
      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } }
        }
      )
    } catch (error) {
      const chain = this.chains.find((x) => x.id === chainId)
      if (!chain)
        throw new ChainNotConfiguredForConnectorError({
          chainId,
          connectorId: this.id
        })

      // Indicates chain is not added to provider
      if (
        (error as ProviderRpcError).code === 4902 ||
        // Unwrapping for MetaMask Mobile
        // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
        (error as ProviderRpcError<{ originalError: { code: number } }>)?.data?.originalError?.code === 4902
      ) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpcUrls.public?.http[0] ?? ''],
                blockExplorerUrls: this.getBlockExplorerUrls(chain)
              }
            ]
          })

          const currentChainId = await this.getChainId()
          if (currentChainId !== chainId)
            throw new UserRejectedRequestError(new Error('User rejected switch after adding network.'))

          return chain
        } catch (error) {
          throw new UserRejectedRequestError(error as Error)
        }
      }

      throw new SwitchChainError(error as Error)
    }
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol
  }: {
    address: Address
    decimals?: number
    image?: string
    symbol: string
  }): Promise<boolean> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.request({
      method: 'wallet_watchAsset',
      params: [
        {
          type: 'ERC20',
          options: {
            address,
            decimals,
            image,
            symbol
          }
        }
      ]
    }) as Promise<boolean>
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')

    this.emit('change', {
      account: getAddress(accounts[0] as string)
    })
  }

  // Ledger HID disconnect (from device)
  protected onDisconnect = async () => {
    this.deactivate()
    // Disconnect Wagmi connector
    this.disconnect()

    // Remove shim signalling wallet is disconnected
    if (this.options.shimDisconnect) this.storage?.removeItem(this.shimDisconnectKey)
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  public isSupported(): boolean {
    return isHIDSupported()
  }

  public async getProvider(config?: { chainId?: number | undefined } | undefined): Promise<LedgerHQProvider> {
    invariant(this.provider, 'Provider is not defined. ChainId: ' + config?.chainId)
    return this.provider
  }

  public async getProviderInstance(): Promise<LedgerHQProvider> {
    const { LedgerHQProvider } = await import('./provider')
    const Provider = new LedgerHQProvider(this.url, this.chainId)

    return Provider
  }

  private async activate(): Promise<ConnectorUpdate<LedgerHQProvider>> {
    try {
      if (!this.provider) {
        this.provider = await this.getProviderInstance()
      }

      const account = await this.provider.enable()
      this.provider.on('disconnect', this.handleDisconnect)

      return { provider: this.provider, account: account as Address }
    } catch (error) {
      return checkError(error)
    }
  }

  public async getChainId(): Promise<number> {
    return this.chainId
  }

  public async getAccount(): Promise<Address> {
    invariant(this.provider, 'Provider is not defined')
    return this.provider.getAddress() as Promise<Address>
  }

  public deactivate(): void {
    invariant(this.provider, 'Provider is not defined')
    this.provider.removeListener('disconnect', this.handleDisconnect)
  }

  // =====================
  // PRIVATE
  // =====================
  private async handleDisconnect(): Promise<void> {
    this.emit('disconnect')
  }
}
