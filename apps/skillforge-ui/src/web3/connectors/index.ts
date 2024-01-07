import { addFrameConnector } from '@past3lle/forge-web3'
import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
import { PstlWeb3AuthConnector, PstlWeb3AuthConnectorProps } from '@past3lle/wagmi-connectors/PstlWeb3AuthConnector'
import { Chain } from '@wagmi/chains'
import { ASSETS_MAP } from 'assets'
import { skillforgeTheme } from 'theme/skillforge'

function _getWhitelistTheme(): PstlWeb3AuthConnectorProps['uiConfig'] {
  if (!JSON.parse(process.env.REACT_APP_WEB3AUTH_WHITELIST_ENABLED || 'false')) return
  
  return {
    theme: {
        primary: skillforgeTheme.modes.DEFAULT.mainBgDarker
    },
    mode: 'DARK',
    logoDark: ASSETS_MAP.logos.forge[512],
    logoLight: ASSETS_MAP.logos.forge[512],
  }
}

const connectors = [
  (chains: Chain[]) =>
    PstlWeb3AuthConnector(chains, {
      network: process.env.REACT_APP_WEB3_AUTH_NETWORK as PstlWeb3AuthConnectorProps['network'],
      projectId: process.env.REACT_APP_WEB3AUTH_ID as string,
      storageKey: 'session',
      preset: 'DISALLOW_EXTERNAL_WALLETS',
      mfaLevel: 'none',
      uxMode: 'popup',
      ..._getWhitelistTheme()
    })
]
const frameConnectors = [addFrameConnector(LedgerIFrameConnector, {})]
export { connectors, frameConnectors }
