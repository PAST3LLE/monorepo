import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { FORGE_LOGO_URL_MAP } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'

export const TorusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {
    buttonPosition: 'bottom-right',
    modalZIndex: 999
  },
  walletInitOptions: {
    whiteLabel: {
      theme: {
        isDark: true,
        colors: {
          torusBrand1: SKILLFORGE_THEME.modes.ALT.mainBg,
          torusBrand2: SKILLFORGE_THEME.modes.DEFAULT.mainBg
        }
      },
      logoDark: FORGE_LOGO_URL_MAP[500]['1x'],
      logoLight: FORGE_LOGO_URL_MAP[500]['1x']
    },
    showTorusButton: true,
    useWalletConnect: true
  }
})
