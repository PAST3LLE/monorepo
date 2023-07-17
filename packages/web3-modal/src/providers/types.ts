import { Address } from '@past3lle/types'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { ConfigCtrlState } from '@web3modal/core'
import { EthereumClient } from '@web3modal/ethereum'
import { Web3ModalProps as Web3ModalConfigOriginal } from '@web3modal/react'
import { Chain as ChainWagmi } from 'wagmi'

import { PstlWeb3ConnectionModalProps } from '../components/modals/ConnectionModal'
import { PstlWeb3AuthConnectorProps } from '../connectors'
import { ConnectorEnhanced } from '../types'
import { PstlWagmiClientOptions } from './utils'

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

type Contract = {
  address: Address
  blockCreated?: number
}

type RpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[]
}

type BlockExplorer = {
  name: string
  url: string
}

type NativeCurrency = {
  name: string
  /** 2-6 characters long */
  symbol: string
  decimals: number
}

type Chain<ID extends number> = {
  /** ID in number form */
  id: ID
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Currency used by chain */
  nativeCurrency: NativeCurrency
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: RpcUrls
    default: RpcUrls
    public: RpcUrls
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Collection of contracts */
  contracts?: {
    ensRegistry?: Contract
    ensUniversalResolver?: Contract
    multicall3?: Contract
  }
  /** Flag for test networks */
  testnet?: boolean
}

export type ChainsPartialReadonly<ID extends number> = DeepReadonly<Chain<ID>>[]

export type Web3ModalThemeVariables = {
  '--w3m-color-bg-1'?: string
  '--w3m-color-bg-2'?: string
  '--w3m-color-fg-1'?: string
} & Web3ModalConfigOriginal['themeVariables']

type Web3ModalConfig<ID extends number> = Omit<
  ConfigCtrlState,
  'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'
> & {
  chains?: Chain<ID>[]
  projectId: string
  w3aProjectId: string
  zIndex?: number
  themeMode?: Web3ModalConfigOriginal['themeMode']
  themeVariables?: Web3ModalThemeVariables
}

export type PstlWeb3ModalOptions = Omit<
  PstlWagmiClientOptions<number>['options'] & {
    /**
     * @name chainFromUrlOptions
     * @description Load chain[number] or network[string] data from URL
     * ! Use with caution. Depending on underlying app URL logic, this can be unreliable / broken!
     * @warning this can be unreliable depending on the base app's existing URL logic
     */
    chainFromUrlOptions?: { key: string; type: 'network' | 'id' }
    /**
     * @name autoConnect
     * @description Boolean. Whether or not to attempt re-connect to last connected connector.
     * @default false
     */
    autoConnect?: boolean
  },
  'publicClient' | 'publicClients' | 'connectors'
>
export interface Web3ModalProps<ID extends number> {
  appName: string
  /**
   * @name chains
   * @description Wagmi chains to allow.
   * @example 
    import { mainnet, goerli, polygon } from '@wagmi/chains'
    ...
    return (
      <PstlW3Providers
        config={{
          chains: [mainnet, goerli, polygon],
          ...
        }}
        ...
      />
    )
   */
  chains: Chain<ID>[]
  /**
   * @name connectors
   * @description Optional. Custom wagmi connectors. Loaded in normal, non-iframe dapps (e.g skills.pastelle.shop). For iFrame connectors, see {@link frameConnectors}
   * @example
      import { InjectedConnector } from 'wagmi/connectors/MetaMask'
      import { addConnector } from '@past3lle/web3-modal'

      addConnector(InjectedConnector, {
        name: 'MetaMask',
        shimDisconnect: true,
        getProvider() {
          try {
            // Add a declarations.d.ts in root /src/ with ethereum object 
            // OR use (window as any)?.ethereum
            const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
            if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
            return provider
          } catch (error) {
            return undefined
          }
        }
      })
   */
  connectors?: ((chains: ChainWagmi[]) => ConnectorEnhanced<any, any>)[]
  /**
   * @name frameConnectors
   * @description iFrame connectors. ONLY loaded in iFrame Dapp browsers (e.g LedgerLive Discovery)
   */
  frameConnectors?: ((chains: ChainWagmi[]) => IFrameEthereumConnector)[]
  /**
   * @name PstlW3Provider.modals
   * @description Modal props: root, walletConnect, web3auth. See each for more info.
   */
  modals: {
    /**
     * @description Root modal props. Mostly UI/UX
     * @example 
     interface PstlWeb3ModalProps.modals.root {
        // Optional. Modal title, appears at top.
        title?: string
        // Optional. Theme config. Set modal theme.
        themeConfig?: ThemeConfigProps
        // Optional. Loader props when async loading wallet modals.
        loaderProps?: LoadingScreenProps
        // Optional. Modal button style props.
        buttonProps?: ButtonProps
        // Optional. Detect connect and auto-close modal.
        closeModalOnConnect?: boolean
        // Optional. Hide detected injected wallet from root modal. 
        // Useful when passing own injected connectors in config.
        hideInjectedFromRoot?: boolean
        // Optional. Set root modal wallets view: 'grid' or 'list'.
        // Default: 'list'. Mobile is ALWAYS in 'list' view.
        walletsView?: 'grid' | 'list'
        // Optional. Key/Value pair overriding connector info. Displays in root modal.
        // Default: undefined
        connectorDisplayOverrides?: ConnectorOverrides
        // Optional. Root modal z-index.
        zIndex?: number
    }
     */
    root?: Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss' | 'chainIdFromUrl' | 'error'>
    /**
     * @name walletConnect
     * @description WalletConnect (Web3Modal) props
     */
    walletConnect: Omit<Web3ModalConfig<ID>, 'w3aProjectId' | 'chains'>
    /**
     * @description Web3Auth modal props. Optional. Leave blank to exclude Web3Auth from modal.
     * @example 
     interface PstlWeb3ModalProps.modals.web3auth {
        themeInfo?: {
          mode?: 'light' | 'dark'
          primary?: string
        }
        chains: ChainsPartialReadonly<ID>
        zIndex?: number
        network: Web3AuthOptions['web3AuthNetwork']
        storageKey?: Web3AuthOptions['storageKey']
        preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS'
        projectId: string
        appName: string
        url?: string
        appLogoLight?: string
        appLogoDark?: string
        listingName?: string
        listingLogo?: string
        listingDetails?: string
        loginMethodsOrder?: string[]
        mfaLevel?: OpenloginLoginParams['mfaLevel']
        uxMode?: 'popup' | 'redirect'
        configureAdditionalConnectors?: () => IPlugin[] | undefined
     }
    */
    web3auth?: Omit<PstlWeb3AuthConnectorProps<ID>, 'chains'>
  }
  clients?: {
    wagmi?: PstlWagmiClientOptions<ID>
    ethereum?: EthereumClient
  }
  options?: PstlWeb3ModalOptions
}

export type PstlWeb3ModalProps<ID extends number> = Web3ModalProps<ID>
export type PstlWeb3ProviderProps<ID extends number> = PstlWeb3ModalProps<ID>

export type WithChainIdFromUrl = {
  chainIdFromUrl: number | undefined
}
