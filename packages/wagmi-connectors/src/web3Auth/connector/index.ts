import { devDebug } from '@past3lle/utils'
import type { IAdapter, IProvider, IWeb3Auth, WALLET_ADAPTER_TYPE } from '@web3auth/base'
import { ADAPTER_STATUS, CHAIN_NAMESPACES, WALLET_ADAPTERS, log } from '@web3auth/base'
import type { IWeb3AuthModal, ModalConfig, Web3Auth } from '@web3auth/modal'
import type { OpenloginLoginParams } from '@web3auth/openlogin-adapter'
import { Address, WalletClient } from 'viem'
import {
  ChainDisconnectedError,
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  getAddress
} from 'viem'
import { ChainNotConfiguredError, ProviderNotFoundError, createConnector, normalizeChainId } from 'wagmi'

import { AdapterMissingError, Web3AuthInstanceMissingError } from './errors'
import type { Options } from './interfaces'

const IS_SERVER = typeof globalThis?.window === 'undefined'

function isIWeb3AuthModal(obj: IWeb3Auth | IWeb3AuthModal): obj is IWeb3AuthModal {
  return typeof (obj as IWeb3AuthModal).initModal !== 'undefined'
}

web3Auth.type = 'web3Auth'
export function web3Auth<A extends IAdapter<unknown>>(options: Options<A>) {
  let web3AuthInstance: Web3Auth | undefined = undefined
  let provider: IProvider | undefined = undefined
  let adapter: A | undefined = undefined
  let plugins: Options<A>['plugins'] = undefined
  let loginParams: OpenloginLoginParams | undefined = undefined
  let modalConfig: Record<WALLET_ADAPTER_TYPE, ModalConfig> | undefined = undefined

  type Properties = {
    ready: boolean
    activate(): Promise<void>
    onConnect(): Promise<void>
    isChainUnsupported(_chainId: number | undefined): boolean
    disconnectListeners(): void
  }
  type StorageItem = {
    [_ in 'web3Auth.connected' | `${string}.disconnected`]: true
  }

  return createConnector<IProvider, Properties, StorageItem>((config) => ({
    ready: false,
    name: 'Web3Auth',
    id: 'web3auth',
    get type() {
      return web3Auth.type
    },
    async activate() {
      if (this.ready) return devDebug(`[@past3lle/wagmi-connectors] ${this.id} already activated, skipping.`)

      web3AuthInstance = options.web3AuthInstance
      adapter = options?.adapter
      plugins = options?.plugins
      loginParams = options.loginParams
      modalConfig = options.modalConfig

      if (!web3AuthInstance) throw new Web3AuthInstanceMissingError()
      if (!adapter) throw new AdapterMissingError()
      web3AuthInstance.configureAdapter(adapter)

      // If user has added custom plugins
      if (!!plugins?.length) {
        plugins?.forEach((plugin) => {
          web3AuthInstance!.addPlugin(plugin)
        })
      }

      this.ready = !IS_SERVER
    },
    async connect({ chainId }: { chainId?: number } = {}) {
      try {
        if (!this.ready) await this.activate()
        config.emitter.emit('message', {
          type: 'connecting'
        })

        await this.getProvider()

        if (!web3AuthInstance) throw new Web3AuthInstanceMissingError()

        if (!web3AuthInstance.connected) {
          if (isIWeb3AuthModal(web3AuthInstance)) {
            await web3AuthInstance.connect()
          } else if (loginParams) {
            await (web3AuthInstance as IWeb3Auth)?.connectTo?.(WALLET_ADAPTERS.OPENLOGIN, loginParams)
          } else {
            log.error('please provide valid loginParams when using @web3auth/no-modal')
            throw new UserRejectedRequestError(
              'please provide valid loginParams when using @web3auth/no-modal' as unknown as Error
            )
          }
        }

        const [accounts, connectedChainId] = await Promise.all([this.getAccounts(), this.getChainId()])
        let unsupported = this.isChainUnsupported(connectedChainId)
        let id: number | undefined = connectedChainId
        if (chainId && connectedChainId !== chainId) {
          // try switching chain
          const chain = await this.switchChain?.({ chainId })
          id = chain?.id
          unsupported = this.isChainUnsupported(id)
        }
        if (!id) throw new ChainDisconnectedError(new Error('On connect chain id undefined!'))
        if (unsupported) throw new ChainNotConfiguredError()

        this.onConnect()

        return {
          accounts,
          chainId: id
        }
      } catch (error) {
        log.error('error while connecting', error)
        this.onDisconnect()
        throw new UserRejectedRequestError('Something went wrong' as unknown as Error)
      }
    },
    async disconnect(): Promise<void> {
      await web3AuthInstance?.logout()
      
      this.onDisconnect()
    },

    async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
      const [provider, [account]] = await Promise.all([this.getProvider(), this.getAccounts()])
      const chain = config.chains.find((x) => x.id === chainId)
      if (!provider) throw new Error('provider is required.')
      return createWalletClient({
        account,
        chain,
        transport: custom(provider)
      })
    },
    async getAccounts(): Promise<Address[]> {
      const provider = await this.getProvider()
      const accounts = await provider.request<unknown, Address[]>({
        method: 'eth_accounts'
      })
      if (!accounts?.length) throw new ChainDisconnectedError(new Error('No accounts returned!'))
      return (accounts.filter(Boolean) as Address[]).map(getAddress)
    },
    async getProvider() {
      if (provider) {
        return provider
      }

      if (!web3AuthInstance) throw new Web3AuthInstanceMissingError()

      if (web3AuthInstance.status === ADAPTER_STATUS.NOT_READY) {
        if (isIWeb3AuthModal(web3AuthInstance) && !!modalConfig) {
          await web3AuthInstance.initModal({
            modalConfig
          })
        } else if (loginParams) {
          await web3AuthInstance.init()
        } else {
          log.error('please provide valid loginParams when using @web3auth/no-modal')
          throw new UserRejectedRequestError(
            new Error('please provide valid loginParams when using @web3auth/no-modal')
          )
        }
      }

      provider = web3AuthInstance?.provider ?? undefined

      if (!provider) throw new ProviderNotFoundError()

      return provider
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return !!accounts?.length
      } catch {
        return false
      }
    },

    async getChainId(): Promise<number> {
      await this.getProvider()
      const chainId = await provider!.request<unknown, string>({ method: 'eth_chainId' })
      log.info('chainId', chainId)
      return normalizeChainId(chainId)
    },

    async switchChain({ chainId }) {
      try {
        const chain = config.chains.find((x) => x.id === chainId)
        if (!chain) throw new SwitchChainError(new Error('chain not found on connector.'))
        if (!web3AuthInstance) throw new Web3AuthInstanceMissingError()

        await web3AuthInstance.addChain({
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: `0x${chain.id.toString(16)}`,
          rpcTarget: chain.rpcUrls.default.http[0],
          displayName: chain.name,
          blockExplorer: chain.blockExplorers?.default.url[0] || '',
          ticker: chain.nativeCurrency?.symbol || 'ETH',
          tickerName: chain.nativeCurrency?.name || 'Ethereum',
          decimals: chain.nativeCurrency.decimals || 18
        })
        log.info('Chain Added: ', chain.name)
        await web3AuthInstance.switchChain({ chainId: `0x${chain.id.toString(16)}` })
        log.info('Chain Switched to ', chain.name)
        return chain
      } catch (error: unknown) {
        log.error('Error: Cannot change chain', error)
        throw new SwitchChainError(error as Error)
      }
    },

    onAccountsChanged: (accounts: string[]): void => {
      if (accounts.length === 0) config.emitter.emit('disconnect')
      else config.emitter.emit('change', { accounts: accounts.map(getAddress) })
    },
    onChainChanged(chainId: string | number): void {
      const id = normalizeChainId(chainId)
      const unsupported = this.isChainUnsupported(id)
      if (unsupported) throw new ChainNotConfiguredError()
      log.info('chainChanged', id, unsupported)
      config.emitter.emit('change', { chainId: id })
    },
    async onConnect() {
      if (!provider) throw new ProviderNotFoundError()
      const accounts = await this.getAccounts()
      const chainId = await this.getChainId()

      config.emitter.emit('connect', {
        accounts,
        chainId
      })

      provider.on('accountsChanged', this.onAccountsChanged.bind(this))
      provider.on('chainChanged', this.onChainChanged.bind(this))
      provider.on('disconnect', this.onDisconnect.bind(this))
      // Listen to emitted events FROM ADAPTER (current web3auth version ~7.x doesnt listen to this)
      // Which never prompts wagmi to update the connector
      // See issue: https://github.com/Web3Auth/web3auth-wagmi-connector/pull/113
      adapter?.provider?.on('accountsChanged', this.onAccountsChanged.bind(this))
      adapter?.provider?.on('chainChanged', this.onChainChanged.bind(this))
      adapter?.provider?.on('disconnect', this.onDisconnect.bind(this))
    },
    onDisconnect() {
      config.emitter.emit('disconnect')
      this.disconnectListeners()
    },
    isChainUnsupported: (chainId: number): boolean => {
      return !config.chains.some((x) => x.id === chainId)
    },
    disconnectListeners() {
      if (!provider) throw new ProviderNotFoundError()
      provider.on('connect', this.onConnect.bind(this))
      provider.off('disconnect', this.onDisconnect.bind(this))
      provider.off('accountsChanged', this.onAccountsChanged.bind(this))
      provider.off('chainChanged', this.onChainChanged.bind(this))
      // bind to adapter provider as well
      adapter?.provider?.off('disconnect', this.onDisconnect.bind(this))
      adapter?.provider?.off('accountsChanged', this.onAccountsChanged.bind(this))
      adapter?.provider?.off('chainChanged', this.onChainChanged.bind(this))
    },
  }))
}

export { Options as Web3AuthParameters }
