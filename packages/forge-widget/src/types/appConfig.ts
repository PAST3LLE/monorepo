import { SkilltreeThemeByModes } from '../theme/types'
import { WalletConnectProps } from '../web3/config/providers/web3Modal'

export interface AppConfig {
  appName: string
  appTheme: SkilltreeThemeByModes
  provider: WalletConnectProps['walletConnect']
}
