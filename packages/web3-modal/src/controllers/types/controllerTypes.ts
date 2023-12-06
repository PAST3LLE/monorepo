import { Chain } from 'viem'

import { AppType } from '../../providers/utils/connectors'
import { ChainImages } from '../../types'
import { ConnectorOverrides } from '../../types/connectors'

// -- ModalCtrl --------------------------------------- //
export interface ModalCtrlState {
  open: boolean
}

interface RootModalState {
  /**
   * @name bypassScrollLock
   * @description Optional. Bypass scroll locking. By default @past3lle/web3-modal freezes scrolling when modal is open.
   * @default undefined
   */
  bypassScrollLock?: boolean
  /**
   * @name softLimitedChains
   * @description Optional. Cosmetically limited chains.
   */
  softLimitedChains?: Chain[]
  /**
   * @name connectorDisplayOverrides
   * @description Optional. Key value pair overriding connector info. Displays in root modal. See {@link ConnectorOverrides}
   */
  connectorDisplayOverrides?: ConnectorOverrides
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
   * @name closeModalOnConnect
   * @default false
   * @description Optional. Detect connector activation and auto-close modal on success
   */
  closeModalOnConnect?: boolean
  openType: 'root' | 'walletconnect'
  appType: AppType | undefined
}

export interface WithError {
  error?: Error | null
}

type AccountModalState = WithError
type NetworkModalState = WithError

type HidDeviceModalState = WithError & {
  hidDeviceId?: string
}

interface ConnectModalState extends WithError {
  /**
   * @name hideInjectedFromRoot
   * @description Optional. Hide (potentially) unknown injected wallet from modal root.
   * @default false
   * @tip Useful when explicitly setting InjectedConnector in root and want to control UI
   */
  hideInjectedFromRoot?: boolean
  /**
   * @name walletsView
   * @description Optional. Arrangement of UI elements in modal. "grid" | "list"
   * @default "list"
   * @tip Mobile always shows elements in "list" view
   */
  walletsView?: 'grid' | 'list'
}

// -- ModalPropsCtrl ------------------------------------ //
export type ModalPropsCtrlState = {
  root: RootModalState
  account: AccountModalState
  connect: ConnectModalState
  network: NetworkModalState
  hidDeviceOptions: HidDeviceModalState
}

// -- ToastCtrl ------------------------------------------ //
export interface ToastCtrlState {
  open: boolean
  message: string
  variant: 'error' | 'success'
}

// -- RouterCtrl --------------------------------------------- //
export type RouterView =
  | 'Account'
  | 'Connectors'
  | 'ConnectWallet'
  | 'DesktopConnector'
  | 'GetWallet'
  | 'Help'
  | 'InjectedConnector'
  | 'InstallConnector'
  | 'HidDeviceOptions'
  | 'ConnectorConfigType'
  | 'Qrcode'
  | 'SelectNetwork'
  | 'SwitchNetwork'
  | 'WalletExplorer'

export interface DesktopConnectorData {
  name: string
  native?: string
  universal?: string
  icon?: string
  walletId?: string
}

export type SwitchNetworkData = Chain

export interface InstallConnectorData {
  id: string
  name: string
  url: string
  isMobile?: boolean
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
