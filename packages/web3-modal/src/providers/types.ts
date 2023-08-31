import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { ConfigCtrlState } from '@web3modal/core'
import { EthereumClient } from '@web3modal/ethereum'
import { Web3ModalProps as Web3ModalConfigOriginal } from '@web3modal/react'
import { Chain as ChainWagmi } from 'wagmi'

import { PstlWeb3ConnectionModalProps } from '../components/modals/ConnectionModal'
import { ConnectorEnhanced } from '../types'
import { Chain } from '../types/chains'
import { PstlWagmiClientOptions } from './utils'
import { AppType } from './utils/connectors'

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
  zIndex?: number
  themeMode?: Web3ModalConfigOriginal['themeMode']
  themeVariables?: Web3ModalThemeVariables
}

export type PstlWeb3ModalCallbacks = {
  /**
   * @name switchChainCallback
   * @description Custom chain switching callback. E.g cookies or from URL -> changes network automatically
   */
  switchChain?: (chains: Chain<number>[], ...params: any[]) => Promise<Chain<number> | undefined>
  /**
   * @name filterChains
   * @description Custom callback for filtering available chains e.g production domain vs develop etc
   * @param chains List of available chains
   * @param params Any params
   * @note this will REMOVE compatibility for chains filtered out. If you just want COSMETIC filtering, see softLimitChains. Will be DEPRECATED next minor release.
   * @alias hardLimitChains
   * @returns Filtered list of available chains
   */
  filterChains?: (chains: Chain<number>[], ...params: any[]) => Chain<number>[]
  /**
   * @name hardLimitChains
   * @description Custom callback for filtering available chains e.g production domain vs develop etc
   * @param chains List of available chains
   * @param params Any params
   * @note this will REMOVE compatibility for chains filtered out. If you just want COSMETIC filtering, see softLimitChains
   * @alias filterChains
   * @returns Filtered list of available chains
   */
  hardLimitChains?: (chains: Chain<number>[], ...params: any[]) => Chain<number>[]
  /**
   * @name softLimitChains
   * @description Custom callback for softly (cosmetically) filtering available chains e.g production domain vs develop etc
   * @param chains List of available chains
   * @param params Any params
   * @note this will REMOVE compatibility for chains filtered out. If you just want COSMETIC filtering, see hardLimitChains
   * @returns Cosmetically filtered list of available chains
   */
  softLimitChains?: (chains: Chain<number>[], ...params: any[]) => Chain<number>[]
}

export type PstlWeb3ModalOptions = Omit<
  PstlWagmiClientOptions<number>['options'] & {
    /**
     * @name autoConnect
     * @description Boolean. Whether or not to attempt re-connect to last connected connector.
     * @default false
     */
    autoConnect?: boolean
    /**
     * @name escapeHatches
     * @description Collection of escape hatch override flags/properties
     */
    escapeHatches?: {
      /**
       * @name appType
       * @description appType is detected and set automtically elsewhere. Escape hatch
       */
      appType?: AppType
    }
    /**
     * @name closeModalOnKeys
     * @description List of string key names to listen for and close modal
     */
    closeModalOnKeys?: string[]
  },
  'publicClient' | 'publicClients' | 'connectors'
>
export type RootModalProps = Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss' | 'chainIdFromUrl' | 'error'>
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
    root?: RootModalProps
    /**
     * @name walletConnect
     * @description WalletConnect (Web3Modal) props
     */
    walletConnect: Omit<Web3ModalConfig<ID>, 'chains'>
  }
  clients?: {
    wagmi?: PstlWagmiClientOptions<ID>
    ethereum?: EthereumClient
  }
  /**
   * Various modal options
   */
  options?: PstlWeb3ModalOptions
  /**
   * Various modal logic callbacks
   */
  callbacks?: PstlWeb3ModalCallbacks
}

export type PstlWeb3ModalProps<ID extends number = number> = Web3ModalProps<ID>
export type PstlWeb3ProviderProps<ID extends number = number> = PstlWeb3ModalProps<ID>

export type WithChainIdFromUrl = {
  chainIdFromUrl: number | undefined
}
export type WithCloseModalOnKeys = Pick<PstlWeb3ModalOptions, 'closeModalOnKeys'>
