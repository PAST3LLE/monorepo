import { ChainNotConfiguredForConnectorError, normalizeChainId } from '@wagmi/connectors'
import invariant from 'tiny-invariant'
import { Account, Chain, SwitchChainError, createWalletClient, custom, getAddress, numberToHex } from 'viem'
import { Address, Connector, ConnectorData, ConnectorNotFoundError, WalletClient } from 'wagmi'

import { ERROR_MESSAGES, ErrorCodes } from './errorCodes'
import { checkError, isHIDSupported } from './helpers'
import type { LedgerHQProvider } from './provider'
import { ConnectorUpdate } from './types'

export { checkError, isHIDSupported }

export type LedgerHidOptions = { shimDisconnect?: boolean; onDeviceDisconnect?: () => Promise<void> }
export class LedgerHIDConnector extends Connector<LedgerHQProvider, LedgerHidOptions> {
  // name & id
  id = 'ledger-hid'
  name = 'Ledger HID'
  // provider/chain info
  url: string
  provider?: LedgerHQProvider
  // flags
  ready: boolean

  // ========
  // PRIVATE
  // ========
  private chainId: number
  // saves each ledger instance per chain id
  private providerByChainMap: Map<number, LedgerHQProvider | undefined> = new Map()

  protected shimDisconnectKey = `${this.id}.shimDisconnect`

  // Ledger only accepts mainnet so these constuctor props are useless
  constructor(config: { chains: Chain[]; options?: LedgerHidOptions }) {
    super({ chains: config.chains, options: config?.options || {} })

    const { id, rpcUrls } = config.chains[0]

    this.chainId = id
    this.url = rpcUrls?.default?.http?.[0]

    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.ready = true
  }

  async connect({ chainId }: { chainId?: number } = {}): Promise<Required<ConnectorData>> {
    try {
      const { account, provider } = await this.activate(chainId)

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
      const statusCode: ErrorCodes | undefined = (error as any)?.statusCode
      switch (statusCode) {
        case 27906:
          throw new Error(ERROR_MESSAGES[statusCode])
        default:
          throw error
      }
    }
  }

  // Wagmi disconnect
  async disconnect() {
    invariant(this.provider, 'Provider not available')

    // desub all providers on disconnect (not just current)
    this.providerByChainMap.forEach((provider) => {
      provider?.removeListener('accountsChanged', this.onAccountsChanged)
      provider?.removeListener('chainChanged', this.onChainChanged)
      provider?.removeListener('disconnect', this.onDisconnect)
    })

    // Remove shim signalling wallet is disconnected
    if (this.options.shimDisconnect) this.storage?.removeItem(this.shimDisconnectKey)
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([this.getProvider({ chainId }), this.getAccount()])
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
      ) {
        throw 'Wallet disconneted'
      }
      const provider = await this.getProvider({ chainId: this.chainId })
      if (!provider) throw new ConnectorNotFoundError()
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const providerAtChainExists = !!this.providerByChainMap.get(chainId)

    const provider = await (!providerAtChainExists ? this.activate(chainId) : this.getProvider({ chainId }))
    if (!provider) throw new ConnectorNotFoundError()

    const id = numberToHex(chainId)
    const currentChain = this.chains.find((x) => x.id === chainId)
    try {
      const derivedChain = currentChain ?? {
        id: chainId,
        name: `Chain ${id}`,
        network: `${id}`,
        nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
        rpcUrls: { default: { http: [''] }, public: { http: [''] } }
      }

      this.chainId = derivedChain.id
      this.url = derivedChain.rpcUrls.default.http[0]

      this.onChainChanged(this.chainId)

      return derivedChain
    } catch (error) {
      if (!currentChain)
        throw new ChainNotConfiguredForConnectorError({
          chainId,
          connectorId: this.id
        })

      // Indicates chain is not added to provider
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
    const provider = await this.getProvider({ chainId: this.chainId })
    if (!provider) throw new ConnectorNotFoundError()

    try {
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
    } catch (error) {
      console.error('[Ledger HID] Asset watching not supported by Ledger HID device.')
      return false
    }
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

  static isSupported(): boolean {
    return isHIDSupported()
  }

  public async getProvider(config?: { chainId?: number | undefined } | undefined): Promise<LedgerHQProvider> {
    const chainId = config?.chainId || this.chainId
    invariant(chainId, '[Ledger HID] No detected chain id! Check configuration.')
    return this.provider || this.getProviderInstance(chainId) // || this.providerByChainMap.get(config.chainId) as LedgerHQProvider
  }

  public async getProviderInstance(id?: number): Promise<LedgerHQProvider> {
    const { LedgerHQProvider } = await import('./provider')
    // getProviderInstance queried without a chain id
    if (!id) {
      // No provider and no id? throw error
      if (!!this.provider?.connection)
        throw new Error('[Ledger HID] Cannot re-instantiate provider without a new chain ID!')
      // Else is initial instantiation, use current chain id
      else
        console.debug(
          '[Ledger HID Connector] Missing instantiation chain ID. Instantiating with constructor chain:',
          this.chainId
        )
    }

    const derivedId = id ?? this.chainId

    const url = this.chains.find((chain) => chain.id === derivedId)?.rpcUrls?.default?.http?.[0]
    if (!url) throw new Error('[Ledger HID] Missing chain URL. Please check chain configuration options.')

    const provider = new LedgerHQProvider(url, derivedId)

    // set the provider mapping with our new provider instance
    this.providerByChainMap.set(derivedId, provider)
    this.provider = provider
    return provider
  }

  private async activate(id?: number): Promise<ConnectorUpdate<LedgerHQProvider>> {
    const noProviderAtChainId = id && !this.providerByChainMap.get(id)

    try {
      if (noProviderAtChainId || !this.provider) {
        this.provider = await this.getProviderInstance(id)
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
    invariant(this.provider, '[Ledger HID] getAccount: Provider is not defined!')
    return this.provider.getAddress() as Promise<Address>
  }

  public deactivate(): void {
    invariant(this.provider, '[Ledger HID] deactivate: Provider is not defined')
    // deactivate all providers in map
    this.providerByChainMap.forEach((provider) => {
      provider?.removeListener('disconnect', this.handleDisconnect)
    })
  }

  // =====================
  // PRIVATE
  // =====================
  private async handleDisconnect(): Promise<void> {
    this.emit('disconnect')
  }
}
