import { ledgerLive, pstlWeb3Auth, PstlWeb3AuthParameters } from '@past3lle/wagmi-connectors'
import { ASSETS_MAP } from 'assets'
import { skillforgeTheme } from 'theme/skillforge'

function _getWhitelistTheme(): PstlWeb3AuthParameters['uiConfig'] {
  if (!JSON.parse(process.env.REACT_APP_WEB3AUTH_WHITELIST_ENABLED || 'false')) return

  return {
    theme: {
      primary: skillforgeTheme.modes.DEFAULT.mainBgDarker
    },
    mode: 'DARK',
    logoDark: ASSETS_MAP.logos.forge[512],
    logoLight: ASSETS_MAP.logos.forge[512]
  }
}

const connectors = [
  pstlWeb3Auth({
    network: process.env.REACT_APP_WEB3_AUTH_NETWORK as PstlWeb3AuthParameters['network'],
    projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
    storageKey: 'session',
    preset: 'DISALLOW_EXTERNAL_WALLETS',
    mfaLevel: 'none',
    uxMode: 'popup',
    ..._getWhitelistTheme()
  })
]
const frameConnectors = [ledgerLive({})]
export { connectors, frameConnectors }
