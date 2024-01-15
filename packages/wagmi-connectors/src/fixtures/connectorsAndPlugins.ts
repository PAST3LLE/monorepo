import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { injected } from 'wagmi/connectors'

import { ledgerHid } from '../ledgerHid'

const TORUS_LOGO = 'https://web3auth.io/docs/contents/logo-ethereum.png'

export const web3authPlugins = {
  TORUS: new TorusWalletConnectorPlugin({
    torusWalletOpts: {
      buttonPosition: 'bottom-left',
      apiKey: process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID
    },
    walletInitOptions: {
      whiteLabel: {
        theme: { isDark: true, colors: { primary: '#00a8ff' } },
        logoDark: TORUS_LOGO,
        logoLight: TORUS_LOGO
      },
      useWalletConnect: true,
      enableLogging: true
    }
  })
}

export const wagmiConnectors = {
  // ledgerLiveModal: addConnector(LedgerConnector, {
  //   enableDebugLogs: false,
  //   walletConnectVersion: 2,
  //   projectId: WALLETCONNECT_ID,
  //   requiredChains: [1]
  // }),
  ledgerHID: ledgerHid
  // ledgerIFrame: () => new LedgerIFrameConnector({ options: {} }),
  // Can also instantiate like this.
  // addConnector is just syntactic sugar
  // PstlWeb3AuthConnector requires this instantiation
  // web3auth: (chains: ReadonlyChains) => {
  //   if (typeof process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID !== 'string') {
  //     throw new Error('Missing REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID!')
  //   }
  //   return PstlWeb3AuthConnector(chains as any, {
  //     projectId: process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID,
  //     network: 'sapphire_devnet',
  //     uiConfig: {
  //       appName: 'SKILLFORGE TEST',
  //       logoLight: FORGE_LOGO,
  //       logoDark: FORGE_LOGO
  //     },
  //     uxMode: 'popup',
  //     preset: 'DISALLOW_EXTERNAL_WALLETS'
  //   })
  // }
}

export const INJECTED_CONNECTORS = [
  injected({
    target() {
      if (typeof globalThis?.window === 'undefined') return undefined
      return {
        name: 'MetaMask',
        id: 'metamask-injected',
        provider() {
          if (typeof globalThis?.window === 'undefined') return undefined
          try {
            const provider = window?.ethereum?.providers?.find((provider: any) => provider?.isMetaMask)
            return provider
          } catch (error) {
            return undefined
          }
        }
      }
    }
  }),
  injected({
    target() {
      return {
        name: 'Taho',
        id: 'taho-injected',
        provider() {
          if (typeof globalThis?.window === 'undefined') return undefined
          try {
            const provider = (window as any)?.tally
            return provider
          } catch (error) {
            return undefined
          }
        }
      }
    }
  }),
  injected({
    target() {
      return {
        name: 'Coinbase Wallet',
        id: 'coinbase-wallet-injected',
        provider() {
          if (typeof globalThis?.window === 'undefined') return undefined
          try {
            const provider = (window?.ethereum?.isCoinbaseWallet && window.ethereum) || window?.coinbaseWalletExtension
            return provider
          } catch (error) {
            return undefined
          }
        }
      }
    }
  })
]
