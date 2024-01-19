import { ledgerLive, pstlWeb3Auth, PstlWeb3AuthParameters } from '@past3lle/wagmi-connectors'
import { ASSETS_MAP } from 'assets'
import { skillforgeTheme } from 'theme/skillforge'
import { ProviderNotFoundError } from 'wagmi'
import { injected } from 'wagmi/connectors'

const IS_SERVER = typeof globalThis?.window === 'undefined'

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
  injected({
    target() {
      if (IS_SERVER) throw new ProviderNotFoundError()
      return {
        name: 'MetaMask',
        id: 'metamask',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
        provider() {
          try {
            if (IS_SERVER) throw new ProviderNotFoundError()
            const provider = window?.ethereum?.isMetaMask
              ? window.ethereum
              : window?.ethereum?.providers?.find((provider: any) => provider?.isMetaMask)
            if (!provider) throw new ProviderNotFoundError()
            return provider
          } catch (error) {
            console.error(error)
            throw error
          }
        }
      }
    }
  }),
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
