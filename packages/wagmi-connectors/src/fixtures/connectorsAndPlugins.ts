import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { injected } from 'wagmi/connectors'

import { iframeEthereum } from '../iframeEthereum'
import { ledgerHid } from '../ledgerHid'
import { ledgerLive } from '../ledgerLive'
import { pstlWeb3Auth } from '../web3Auth'

if (!process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID) {
  throw new Error('Missing process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID!')
}

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
  ledgerLive,
  ledgerHid,
  iframe: iframeEthereum,
  web3auth: pstlWeb3Auth
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
