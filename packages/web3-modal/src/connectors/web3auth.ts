// Web3Auth Libraries
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector as Web3AuthConnectorCreator } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'wagmi'

const SOCIAL_LOGO = 'https://www.getopensocial.com/wp-content/uploads/2020/12/social-login-COLOR_2.png'
const NET = process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet'

class Web3AuthEnhancedConnector extends Web3AuthConnectorCreator {
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
    options: Web3AuthConnectorCreator['options']
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
  listingName?: string
  listingLogo?: string
  loginMethodsOrder?: string[]
  modalZIndex?: string
  w3aId: string
  preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS'
}

export function PstlWeb3AuthConnector({
  appName,
  appLogoDark,
  appLogoLight,
  chains,
  listingName = 'Social',
  listingLogo = SOCIAL_LOGO,
  loginMethodsOrder,
  modalZIndex = '2147483647',
  preset = 'ALLOW_EXTERNAL_WALLETS',
  theme = 'dark',
  w3aId
}: PstlWeb3AuthConnectorProps) {
  if (!w3aId) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol
  }

  // Create Web3Auth Instance
  const web3AuthInstance = new Web3Auth({
    clientId: w3aId,
    chainConfig,
    uiConfig: {
      appName,
      theme,
      loginMethodsOrder,
      defaultLanguage: 'en',
      appLogo: theme === 'light' ? appLogoLight : appLogoDark,
      modalZIndex
    }
  })
  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network: NET,
      uxMode: 'popup',
      whiteLabel: {
        name: appName,
        logoLight: appLogoLight,
        logoDark: appLogoDark,
        defaultLanguage: 'en',
        dark: theme === 'dark' // whether to enable dark mode. defaultValue: false
      }
    }
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  return new Web3AuthEnhancedConnector({
    name: listingName,
    logo: listingLogo,
    chains,
    options: {
      web3AuthInstance,
      modalConfig:
        preset === 'DISALLOW_EXTERNAL_WALLETS'
          ? {
              [WALLET_ADAPTERS.METAMASK]: {
                label: 'MetaMask',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              },
              [WALLET_ADAPTERS.TORUS_EVM]: {
                label: 'Torus',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              },
              [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
                label: 'WalletConnect [v1]',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              },
              [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                label: 'WalletConnect [v2]',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              }
            }
          : undefined
    }
  })
}
