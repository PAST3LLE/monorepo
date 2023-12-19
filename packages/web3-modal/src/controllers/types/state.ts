import { Chain, type useConnect } from 'wagmi'

import { PstlWeb3ModalProps } from '../../providers'
import { AppType } from '../../providers/utils/connectors'
import { ChainImages } from '../../types'
import { ConnectorOverrides } from '../../types/connectors'
import { AnyTransactionReceipt } from '../TransactionsCtrl/types'
import { DesktopConnectorData, InstallConnectorData, RouterView, SwitchNetworkData } from './controllerTypes'

// -- ModalCtrl --------------------------------------- //
export interface ModalCtrlState {
  open: boolean
  error?: Error
  pendingConnectorId?: string
}

// -- TransactionsCtrl ------------------------------------------- //
export type TransactionsCtrlState = {
  [chainId: number]: AnyTransactionReceipt[] | undefined
}

// -- ConnectionStatusCtrl --------------------------------------- //
export type ConnectionStatusCtrlState = {
  ids: string[]
  status?: ReturnType<typeof useConnect>['status']
  retry?: ReturnType<typeof useConnect>['connectAsync']
}

// -- UserOptionsCtrlState ------------------------------------ //
export interface UserOptionsCtrlState {
  ux: {
    appType?: AppType | undefined
    /**
     * @name bypassScrollLock
     * @description Optional. Bypass scroll locking. By default @past3lle/web3-modal freezes scrolling when modal is open.
     * @default undefined
     */
    bypassScrollLock?: boolean
    /**
     * @name closeModalOnConnect
     * @default false
     * @description Optional. Detect connector activation and auto-close modal on success
     */
    closeModalOnConnect?: boolean
  }
  chains: {
    /**
     * @name blockExplorerUris
     * @description See {@link PstlWeb3ModalProps.blockExplorerUris}
     */
    blockExplorerUris?: PstlWeb3ModalProps['blockExplorerUris']
  }
  connectors: {
    /**
     * @name hideInjectedFromRoot
     * @description Optional. Hide (potentially) unknown injected wallet from modal root.
     * @default false
     * @tip Useful when explicitly setting InjectedConnector in root and want to control UI
     */
    hideInjectedFromRoot?: boolean
    /**
     * @name overrides
     * @description Optional. Key value pair overriding connector info. Displays in root modal. See {@link ConnectorOverrides}
     */
    overrides?: ConnectorOverrides
  }
  ui: {
    /**
     * @name softLimitedChains
     * @description Optional. Cosmetically limited chains from Network modal switcher.
     */
    softLimitedChains?: Chain[]
    /**
       * @name chainImages
       * @default {
          1: 'https://swap.cow.fi/assets/network-mainnet-logo-ac64fb79.svg',
          5: 'https://swap.cow.fi/assets/network-goerli-logo-2b81b421.svg'
        }
       * @description Optional. Key/value pair overriding/setting chain images by chain ID.
       */
    chainImages?: ChainImages
    /**
     * @name walletsView
     * @description Optional. Arrangement of UI elements in modal. "grid" | "list"
     * @default "list"
     * @tip Mobile always shows elements in "list" view
     */
    walletsView?: 'grid' | 'list'
  }
}

export type FlattenedUserConfigCtrlState = UserOptionsCtrlState['connectors'] &
  UserOptionsCtrlState['ui'] &
  UserOptionsCtrlState['ux']

// -- ToastCtrl ------------------------------------------ //
export interface ToastCtrlState {
  open: boolean
  message: string
  variant: 'error' | 'success'
}
export interface RouterCtrlState {
  history: RouterView[]
  view: RouterView
  data?: {
    DesktopConnector?: DesktopConnectorData
    SwitchNetwork?: SwitchNetworkData
    InstallConnector?: InstallConnectorData
  }
}
