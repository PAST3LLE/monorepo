import { ExternalProvider, Web3Provider } from '@ethersproject/providers'
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider'
import {
  Address,
  Chain,
  ChainDisconnectedError,
  ProviderRpcError,
  ResourceUnavailableRpcError,
  RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  WalletClient,
  createWalletClient,
  getAddress,
  http,
  toHex
} from 'viem'
import { ChainNotConfiguredError, ConnectorNotFoundError, createConnector, normalizeChainId } from 'wagmi'

export type IframeEthereumParameters = ConstructorParameters<typeof IFrameEthereumProvider>[0] & {
  name?: string
  id?: string
  type?: string
  defaultRpcUrl?: string
}
const IS_SERVER = typeof globalThis?.window === 'undefined'
const DEFAULT_RPC_URL = 'https://eth.llamarpc.com'

iframeEthereum.type = 'iframe-ethereum'
export function iframeEthereum(options?: IframeEthereumParameters) {
  type Properties = {
    isChainUnsupported(_chainId: number | undefined): boolean
    ready: boolean
  }
  type StorageItem = {
    [_ in 'iframe-ethereum.connected' | `${string}.disconnected`]: true
  }
  let provider: undefined | IFrameEthereumProvider = undefined
  let defaultRpcUrl = options?.defaultRpcUrl || DEFAULT_RPC_URL
  let ready = false

  // protected
  function isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001
  }

  return createConnector<IFrameEthereumProvider, Properties, StorageItem>((config) => ({
    name: options?.name || 'iFrame Ethereum Connector',
    id: options?.id || 'iframe-ethereum',
    isIframe: true,
    get type() {
      return options?.type || iframeEthereum.type
    },
    ready,
    async setup() {
      ready = !IS_SERVER
    },

    async connect({ chainId: _chainId }: { chainId?: number } = {}) {
      try {
        await this.getProvider()
        if (!provider) throw new ConnectorNotFoundError()

        if (provider.on) {
          provider.on('accountsChanged', this.onAccountsChanged.bind(this))
          provider.on('chainChanged', this.onChainChanged)
        }

        config.emitter.emit('message', { type: 'connecting' })

        const accounts = await this.getAccounts()
        // Switch to chain if provided
        let id = await this.getChainId()
        let unsupported = this.isChainUnsupported(id)
        if (_chainId && id !== _chainId) {
          const chain = await this.switchChain?.({ chainId: _chainId })
          if (chain?.id) id = chain.id
          unsupported = this.isChainUnsupported(id)
        }

        if (unsupported) throw new ChainNotConfiguredError()
        if (!id) throw new ChainDisconnectedError(new Error(`[${this.id}] Connect method "id" undefined!`))

        this.onConnect?.({ chainId: id?.toString() })

        return { accounts: accounts as Address[], chainId: id, provider }
      } catch (error) {
        if (isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error as Error)
        if ((error as RpcError).code === -32002) throw new ResourceUnavailableRpcError(error as Error)
        throw error
      }
    },

    async disconnect() {
      const provider = await this.getProvider()
      if (!provider?.removeListener)
        throw new Error(`${this.id} provider missing! Check that you are in an iFrame environment.`)

      provider.removeListener('accountsChanged', this.onAccountsChanged)
      provider.removeListener('chainChanged', this.onChainChanged)
    },

    async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
      const [provider, [account]] = await Promise.all([this.getProvider(), this.getAccounts()])
      const chain = config.chains.find((x) => x.id === chainId)
      if (!provider) throw new Error('provider is required.')
      return createWalletClient({
        account,
        chain,
        transport: http(chain?.rpcUrls.default.http[0] || defaultRpcUrl)
      })
    },

    async getAccounts() {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      const accounts = await provider.send('eth_requestAccounts', [])
      // return checksum address
      return accounts.map(getAddress) as Address[]
    },

    async getChainId() {
      if (!provider) throw new ConnectorNotFoundError()
      return provider.send('eth_chainId').then(normalizeChainId)
    },

    async getProvider() {
      if (!provider) {
        provider = new IFrameEthereumProvider(options)
      }
      return provider
    },

    async getSigner() {
      const [provider, [account]] = await Promise.all([this.getProvider(), this.getAccounts()])
      return new Web3Provider(provider as unknown as ExternalProvider).getSigner(account)
    },

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
    },

    async switchChain({ chainId }): Promise<Chain> {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      const id = toHex(chainId)

      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: id }])

        return (
          config.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${id}`,
            nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
            rpcUrls: { default: { http: [''] }, public: { http: [''] } }
          }
        )
      } catch (error) {
        const chain = config.chains.find((x) => x.id === chainId)
        if (!chain) throw new ChainNotConfiguredError()

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
                blockExplorerUrls: chain.blockExplorers
              }
            ])

            return chain
          } catch (addError) {
            if (isUserRejectedRequestError(addError)) throw new UserRejectedRequestError(error as Error)
            throw new ChainNotConfiguredError()
          }
        }

        if (isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error as Error)
        throw new SwitchChainError(error as Error)
      }
    },

    async watchAsset({
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
    },

    async onConnect(connectInfo) {
      const accounts = await this.getAccounts()
      config.emitter.emit('connect', { chainId: normalizeChainId(connectInfo?.chainId), accounts })
    },

    onDisconnect: () => {
      config.emitter.emit('disconnect')
    },

    onAccountsChanged: (accounts: string[]) => {
      if (accounts.length === 0 || !accounts[0]) {
        config.emitter.emit('disconnect')
      } else {
        config.emitter.emit('change', { accounts: accounts.map(getAddress) as Address[] })
      }
    },

    onChainChanged: (chainId: number | string) => {
      const id = normalizeChainId(chainId)
      config.emitter.emit('change', { chainId: id })
    },

    isChainUnsupported(_chainId: number | undefined) {
      return !config.chains.some((chain) => chain.id === _chainId)
    }
  }))
}
