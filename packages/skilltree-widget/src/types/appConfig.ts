import { SkilltreeThemeByModes } from '../theme/types'
import { WalletConnectProps } from '../web3/config'

export interface AppConfig {
  appName: string
  appTheme: SkilltreeThemeByModes
  provider: WalletConnectProps['walletConnect']
}
