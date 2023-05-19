// Web3Auth Libraries
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { IPlugin } from '@web3auth/base-plugin'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'wagmi'

import { Z_INDICES } from '../constants'

export interface PstlWeb3AuthConnectorProps {
  theme?: 'light' | 'dark'
  chains: Chain[]
  zIndex?: number
  network: 'mainnet' | 'testnet' | 'development' | 'cyan'
  preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS'
  projectId: string
  appName: string
  appLogoLight?: string
  appLogoDark?: string
  listingName?: string
  listingLogo?: string
  listingDetails?: string
  loginMethodsOrder?: string[]
  configureAdditionalConnectors?: () => IPlugin[] | undefined
}

export function PstlWeb3AuthConnector({
  chains,
  network,
  appName,
  projectId,
  theme = 'dark',
  appLogoDark,
  appLogoLight,
  loginMethodsOrder,
  zIndex = Z_INDICES.W3A,
  preset = 'ALLOW_EXTERNAL_WALLETS',
  configureAdditionalConnectors
}: PstlWeb3AuthConnectorProps) {
  if (!projectId) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')

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
    clientId: projectId,
    chainConfig,
    web3AuthNetwork: network,
    uiConfig: {
      appName,
      theme,
      loginMethodsOrder,
      defaultLanguage: 'en',
      appLogo: theme === 'light' ? appLogoLight : appLogoDark,
      modalZIndex: zIndex.toString()
    }
  })
  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network,
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

  // custom connector callback
  const pluginsList = configureAdditionalConnectors?.()
  if (!!pluginsList?.length) {
    pluginsList?.forEach((plugin) => web3AuthInstance.addPlugin(plugin))
  }

  return new Web3AuthConnector({
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
