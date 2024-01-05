import { addFrameConnector } from '@past3lle/forge-web3'
import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
import { PstlWeb3AuthConnector } from '@past3lle/wagmi-connectors/PstlWeb3AuthConnector'
import { Chain } from '@wagmi/chains'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { ASSETS_MAP } from 'assets'
import { FORGE_LOGO_URL_MAP } from 'theme/pstlModal'
import { skillforgeTheme as SKILLFORGE_THEME, skillforgeTheme } from 'theme/skillforge'
import { SKILLFORGE_APP_NAME } from 'web3/config/skillforge'

const connectors = [
  (chains: Chain[]) =>
    PstlWeb3AuthConnector(chains, {
      appName: SKILLFORGE_APP_NAME,
      // CYAN = USA focused
      network: process.env.REACT_APP_WEB3_AUTH_NETWORK as Required<
        Parameters<typeof PstlWeb3AuthConnector>
      >[1]['network'],
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'popup',
      themeInfo: {
        mode: 'dark',
        primary: skillforgeTheme.modes.DEFAULT.mainBg
      },
      appLogoDark: ASSETS_MAP.logos.forge[512],
      appLogoLight: ASSETS_MAP.logos.forge[512],
      url: 'https://skills.pastelle.shop',
      configureAdditionalConnectors() {
        // Add Torus Wallet Plugin (optional)
        const torusPlugin = new TorusWalletConnectorPlugin({
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

        return [torusPlugin]
      }
    })
]
const frameConnectors = [addFrameConnector(LedgerIFrameConnector, {})]
export { connectors, frameConnectors }
