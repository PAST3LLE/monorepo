import { SkilltreeThemeByModes } from '../theme/types'
import { WalletConnectProps } from '../../../forge-web3/src/providers/web3Modal'

export interface AppConfig {
  appName: string
  appTheme: SkilltreeThemeByModes
  provider: WalletConnectProps['walletConnect']
}
