import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { ProviderNotFoundError } from 'wagmi'
import { injected } from 'wagmi/connectors'

import { iframeEthereum } from '../iframeEthereum'
import { ledgerHid } from '../ledgerHid'
import { ledgerLive } from '../ledgerLive'
import { pstlWeb3Auth } from '../web3Auth'

const IS_SERVER = typeof globalThis?.window === 'undefined'

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
      if (IS_SERVER) throw new ProviderNotFoundError()
      return {
        name: 'MetaMask',
        id: 'metamask-injected',
        provider() {
          try {
            if (IS_SERVER) throw new ProviderNotFoundError()
            const provider = window?.ethereum?.providers?.find((provider: any) => provider?.isMetaMask)
            if (!provider) throw new ProviderNotFoundError()
            return provider
          } catch (error) {
            console.error(error)
            throw error
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
          try {
            if (IS_SERVER) throw new ProviderNotFoundError()
            const provider = (window as any)?.tally
            if (!provider) throw new ProviderNotFoundError()
            return provider
          } catch (error) {
            console.error(error)
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
          try {
            if (IS_SERVER) throw new ProviderNotFoundError()
            const provider = window?.coinbaseWalletExtension || (window?.ethereum?.isCoinbaseWallet && window.ethereum)
            if (!provider) throw new ProviderNotFoundError()
            return provider
          } catch (error) {
            console.error(error)
            return undefined
          }
        }
      }
    }
  })
]
