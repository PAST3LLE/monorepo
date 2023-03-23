// Web3Auth Libraries
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'wagmi'

const LOGO = 'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/public/512_logo.png'

// TESTING KEY DO NOT USE IN PROD
const AUTH_ID = 'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'
export default function Web3AuthConnectorInstance(chains: Chain[]) {
  if (!AUTH_ID) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')
  // Create Web3Auth Instance
  const name = 'SKILLFORGE'
  const web3AuthInstance = new Web3Auth({
    clientId: AUTH_ID,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x' + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol
    },
    uiConfig: {
      appName: name,
      theme: 'dark',
      loginMethodsOrder: ['google', 'github', 'facebook'],
      defaultLanguage: 'en',
      appLogo: LOGO,
      modalZIndex: '2147483647'
    }
  })
  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network: 'testnet',
      uxMode: 'popup',
      whiteLabel: {
        name: 'SKILLFORGE',
        logoLight: LOGO,
        logoDark: LOGO,
        defaultLanguage: 'en',
        dark: true // whether to enable dark mode. defaultValue: false
      }
    }
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  // Add Torus Wallet Plugin (optional)
  const torusPlugin = new TorusWalletConnectorPlugin({
    torusWalletOpts: {
      buttonPosition: 'bottom-left'
    },
    walletInitOptions: {
      whiteLabel: {
        theme: { isDark: true, colors: { primary: '#00a8ff' } },
        logoDark: LOGO,
        logoLight: LOGO
      },
      useWalletConnect: true,
      enableLogging: true
    }
  })
  web3AuthInstance.addPlugin(torusPlugin)

  return new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance
    }
  })
}
