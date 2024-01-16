// Web3Auth Libraries
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter, OpenloginLoginParams } from '@web3auth/openlogin-adapter'
import { createConnector } from 'wagmi'

import { Web3AuthParameters, web3Auth } from './connector/index'

// import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'

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

export interface PstlWeb3AuthParameters extends Omit<Web3AuthParameters, 'adapter' | 'web3AuthInstance'> {
  network: Web3AuthOptions['web3AuthNetwork']
  storageKey?: Web3AuthOptions['storageKey']
  preset?: 'DISALLOW_EXTERNAL_WALLETS' | 'ALLOW_EXTERNAL_WALLETS'
  projectId: string
  uiConfig?: Web3AuthOptions['uiConfig']
  mfaLevel?: OpenloginLoginParams['mfaLevel']
  uxMode?: 'popup' | 'redirect'
}
export function pstlWeb3Auth(options: PstlWeb3AuthParameters) {
  return createConnector((config) => {
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x' + (config.chains[0].id as number).toString(16),
      rpcTarget: config.chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      blockExplorer: config.chains[0].blockExplorers?.default?.url || '',
      displayName: config.chains[0].name,
      tickerName: config.chains[0].nativeCurrency?.name,
      ticker: config.chains[0].nativeCurrency?.symbol
    }
    return web3Auth({
      ...options,
      web3AuthInstance: new Web3Auth({
        clientId: options.projectId,
        chainConfig,
        web3AuthNetwork: options.network,
        authMode: 'DAPP',
        uiConfig: options.uiConfig
      }),
      adapter: new OpenloginAdapter({
        privateKeyProvider: !options.plugins?.length
          ? new EthereumPrivateKeyProvider({
              config: {
                chainConfig
              }
            })
          : undefined,
        adapterSettings: {
          network: options.network,
          uxMode: options.uxMode,
          storageKey: options.storageKey,
          whiteLabel: options.uiConfig
        },
        loginSettings: {
          mfaLevel: options.mfaLevel
        }
      }),
      modalConfig:
        options?.preset === 'DISALLOW_EXTERNAL_WALLETS'
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
    })(config)
  })
}
