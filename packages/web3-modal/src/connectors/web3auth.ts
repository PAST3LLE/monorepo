// Web3Auth Libraries
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { IPlugin } from '@web3auth/base-plugin'
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter, OpenloginLoginParams } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

import { Z_INDICES } from '../constants'
import { ChainsPartialReadonly } from '../providers/types'

export interface PstlWeb3AuthConnectorProps<ID extends number> {
  themeInfo?: {
    mode?: 'light' | 'dark'
    primary?: string
  }
  chains: ChainsPartialReadonly<ID>
  zIndex?: number
  network: Web3AuthOptions['web3AuthNetwork']
  storageKey?: Web3AuthOptions['storageKey']
  preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS'
  projectId: string
  appName: string
  url?: string
  appLogoLight?: string
  appLogoDark?: string
  listingName?: string
  listingLogo?: string
  listingDetails?: string
  loginMethodsOrder?: string[]
  mfaLevel?: OpenloginLoginParams['mfaLevel']
  uxMode?: 'popup' | 'redirect'
  configureAdditionalConnectors?: () => IPlugin[] | undefined
}

export function PstlWeb3AuthConnector<ID extends number>({
  chains,
  network = 'testnet',
  appName,
  projectId,
  themeInfo = {
    mode: 'dark'
  },
  storageKey,
  appLogoDark,
  appLogoLight,
  url,
  loginMethodsOrder,
  mfaLevel,
  uxMode,
  zIndex = Z_INDICES.W3A,
  preset = 'ALLOW_EXTERNAL_WALLETS',
  configureAdditionalConnectors
}: PstlWeb3AuthConnectorProps<ID>): Web3AuthConnector {
  if (!projectId) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + (chains[0].id as number).toString(16),
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
    authMode: 'DAPP',
    uiConfig: {
      appName,
      theme: themeInfo.mode,
      loginMethodsOrder,
      defaultLanguage: 'en',
      appLogo: themeInfo.mode === 'light' ? appLogoLight : appLogoDark,
      modalZIndex: zIndex.toString()
    }
  })
  // Add openlogin adapter for customisations
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network,
      uxMode,
      storageKey,
      whiteLabel: {
        name: appName,
        url,
        logoLight: appLogoLight,
        logoDark: appLogoDark,
        defaultLanguage: 'en',
        theme: {
          primary: themeInfo.primary
        },
        dark: themeInfo.mode === 'dark' // whether to enable dark mode. defaultValue: false
      }
    },
    loginSettings: {
      mfaLevel
    }
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  // custom connector callback
  const pluginsList = configureAdditionalConnectors?.()
  if (!!pluginsList?.length) {
    pluginsList?.forEach((plugin) => {
      web3AuthInstance.addPlugin(plugin)
    })
  }

  return new Web3AuthConnector({
    chains: chains as ChainsPartialReadonly<number>,
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
