import { Chain } from 'viem'

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
  | 'ConnectionApproval'
  | 'Transactions'

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
