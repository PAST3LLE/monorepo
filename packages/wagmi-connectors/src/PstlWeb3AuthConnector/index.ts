// Web3Auth Libraries
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter, OpenloginLoginParams, WhiteLabelData } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'viem'

import { AuxWeb3AuthConnector } from './class'

export interface PstlWeb3AuthConnectorProps {
  themeInfo?: {
    mode?: WhiteLabelData['mode']
    customTheme?: WhiteLabelData['theme']
  }
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
  plugins?: Parameters<Web3Auth['addPlugin']>[0][]
}

/**
     * @description Web3Auth modal connector
     * @param options - options / config object:
     * @example 
     interface Options {
        themeInfo?: {
          mode?: WhiteLabelData['mode']
          customTheme?: WhiteLabelData['theme']
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
        plugins?: IPlugin[] | undefined
     }
    */
export function PstlWeb3AuthConnector(chains: Chain[], options: PstlWeb3AuthConnectorProps): Web3AuthConnector {
  const {
    network = 'sapphire_devnet',
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
    zIndex = 1000,
    preset = 'ALLOW_EXTERNAL_WALLETS',
    plugins
  } = options
  if (!projectId) throw new Error('Missing REACT_APP_WEB3AUTH_ID! Check env.')

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + (chains[0].id as number).toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    blockExplorer: chains[0].blockExplorers?.default?.url || '',
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol
  } as const

  // Create Web3Auth Instance
  const web3AuthInstance = new Web3Auth({
    clientId: projectId,
    chainConfig,
    web3AuthNetwork: network,
    authMode: 'DAPP',
    uiConfig: {
      appName,
      theme: themeInfo?.customTheme,
      loginMethodsOrder,
      defaultLanguage: 'en',
      logoLight: appLogoLight,
      logoDark: appLogoDark,
      modalZIndex: zIndex.toString()
    }
  })
  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
      chainConfig
    }
  })
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider: !plugins?.length ? privateKeyProvider : undefined,
    adapterSettings: {
      network,
      uxMode,
      storageKey,
      whiteLabel: {
        appName,
        appUrl: url,
        logoLight: appLogoLight,
        logoDark: appLogoDark,
        defaultLanguage: 'en',
        theme: themeInfo.customTheme
      }
    },
    loginSettings: {
      mfaLevel
    }
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  // If user has added custom plugins
  if (!!plugins?.length) {
    plugins?.forEach((plugin) => {
      web3AuthInstance.addPlugin(plugin)
    })
  }

  return new AuxWeb3AuthConnector({
    chains,
    options: {
      adapter: openloginAdapterInstance,
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
              [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                label: 'WalletConnect [v2]',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              },
              [WALLET_ADAPTERS.COINBASE]: {
                label: 'Coinbase Wallet',
                showOnDesktop: false,
                showOnModal: false,
                showOnMobile: false
              }
            }
          : undefined
    }
  })
}
