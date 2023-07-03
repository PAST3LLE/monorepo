import { ExternalProvider, Web3Provider } from '@ethersproject/providers'
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider'
import { ConnectorNotFoundError, normalizeChainId } from '@wagmi/connectors'
import {
  Account,
  Address,
  ProviderRpcError,
  ResourceUnavailableRpcError,
  RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  getAddress,
  http,
  toHex
} from 'viem'
import { Chain, ChainNotConfiguredError, Connector, WalletClient } from 'wagmi'

type IFrameEthereumProviderOptions = ConstructorParameters<typeof IFrameEthereumProvider>[0]
const DEFAULT_RPC_URL = 'https://eth.llamarpc.com'
export class IFrameEthereumConnector extends Connector<IFrameEthereumProvider, IFrameEthereumProviderOptions> {
  readonly id = 'ledgerLive'
  readonly name = 'Ledger Live'
  readonly ready = true
  readonly isIFrame = true

  providerInstance?: IFrameEthereumProvider

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
      }

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return { account: account as Address, chain: { id, unsupported }, provider }
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error as Error)
      if ((error as RpcError).code === -32002) throw new ResourceUnavailableRpcError(error as Error)
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider?.removeListener) return

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()])
    const chain = this.chains.find((x) => x.id === chainId)
    if (!provider) throw new Error('provider is required.')
    return createWalletClient({
      account: account as Account | `0x${string}` | undefined,
      chain,
      transport: http(chain?.rpcUrls.default.http[0] || DEFAULT_RPC_URL)
    })
  }

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const accounts = await provider.send('eth_requestAccounts', [])
    // return checksum address
    return getAddress(accounts[0] as string) as Address
  }

  async getChainId() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.send('eth_chainId').then(normalizeChainId)
  }

  async getProvider() {
    if (!this.providerInstance) {
      this.providerInstance = new IFrameEthereumProvider(this.options)
    }
    return this.providerInstance
  }

  async getSigner() {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()])
    return new Web3Provider(provider as unknown as ExternalProvider).getSigner(account)
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      const accounts = await provider.send('eth_accounts')
      const account = accounts[0]
      return !!account
    } catch {
      return false
    }
  }

  override async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const id = toHex(chainId)

    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: id }])

      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } }
        }
      )
    } catch (error) {
      const chain = this.chains.find((x) => x.id === chainId)
      if (!chain) throw new ChainNotConfiguredError({ chainId, connectorId: this.id })

      // Indicates chain is not added to provider
      if (
        (error as ProviderRpcError).code === 4902 ||
        // Unwrapping for MetaMask Mobile
        // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
        (error as any)?.data?.originalError?.code === 4902
      ) {
        try {
          await provider.send('wallet_addEthereumChain', [
            {
              chainId: id,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrls.public ?? chain.rpcUrls.default],
              blockExplorerUrls: this.getBlockExplorerUrls(chain)
            }
          ])

          return chain
        } catch (addError) {
          if (this.isUserRejectedRequestError(addError)) throw new UserRejectedRequestError(error as Error)
          throw new ChainNotConfiguredError({ chainId })
        }
      }

      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error as Error)
      throw new SwitchChainError(error as Error)
    }
  }

  override async watchAsset({
    address,
    decimals = 18,
    image,
    symbol
  }: {
    address: string
    decimals?: number
    image?: string
    symbol: string
  }) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    return provider.send('wallet_watchAsset', [
      {
        type: 'ERC20',
        options: {
          address,
          decimals,
          image,
          symbol
        }
      }
    ])
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0 || !accounts[0]) {
      this.emit('disconnect')
    } else {
      this.emit('change', { account: getAddress(accounts[0]) as Address })
    }
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  // eslint-disable-next-line class-methods-use-this
  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
