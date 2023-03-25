// Web3Auth Libraries
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'wagmi'

const LOGO = 'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/public/512_logo.png'
const NET = process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet'

class Web3AuthEnhancedConnector extends Web3AuthConnector {
  public customName: string
  public logo: string

  constructor({
    name,
    logo,
    ...rest
  }: {
    name: string
    logo: string
    chains?: Chain[] | undefined
    options: Web3AuthConnector['options']
  }) {
    super(rest)
    this.customName = name
    this.logo = logo
  }
}

export interface PstlWeb3AuthConnectorProps {
  appName: string
  appLogoLight?: string
  appLogoDark?: string
  theme?: 'light' | 'dark'
  chains: Chain[]
  loginMethodsOrder?: string[]
  modalZIndex?: string
  w3aId: string
}

export default function Web3AuthConnectorInstance({
  appName,
  appLogoDark,
  appLogoLight,
  chains,
  loginMethodsOrder = ['google', 'github', 'twitter', 'discord'],
  modalZIndex = '2147483647',
  theme = 'dark',
  w3aId
}: PstlWeb3AuthConnectorProps) {
  if (!w3aId) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')
  // Create Web3Auth Instance
  const web3AuthInstance = new Web3Auth({
    clientId: w3aId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.OTHER,
      chainId: '0x' + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol
    },
    uiConfig: {
      appName,
      theme,
      loginMethodsOrder,
      defaultLanguage: 'en',
      appLogo: appLogoLight || appLogoDark,
      modalZIndex
    }
  })
  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network: NET,
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

  return new Web3AuthEnhancedConnector({
    name: 'Social Login',
    logo: LOGO,
    chains,
    options: {
      web3AuthInstance
    }
  })
}
