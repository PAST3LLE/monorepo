// Web3Auth Libraries
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import LOGO from 'assets/png/forge.png'
import { Chain } from 'wagmi'

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  if (!process.env.REACT_APP_WEB3AUTH_ID) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')

  // Create Web3Auth Instance
  const name = 'SKILLFORGE'
  const web3AuthInstance = new Web3Auth({
    clientId: process.env.REACT_APP_WEB3AUTH_ID,
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
