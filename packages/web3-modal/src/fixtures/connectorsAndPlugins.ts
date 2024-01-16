import { devWarn } from '@past3lle/utils'
import { iframeEthereum, ledgerLive, pstlWeb3Auth } from '@past3lle/wagmi-connectors'
import { ledgerHid } from '@past3lle/wagmi-connectors/ledgerHid'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { injected } from 'wagmi/connectors'

import { FORGE_LOGO } from './config'

if (!process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID) {
  throw new Error('Missing REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID variable. Check .env')
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
  ledgerLiveModal: ledgerLive({}),
  ledgerHID: ledgerHid({ shimDisconnect: true }),
  ledgerIFrame: iframeEthereum({}),
  web3auth: pstlWeb3Auth({
    projectId: process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID,
    network: 'sapphire_devnet',
    uiConfig: {
      appName: 'SKILLFORGE TEST',
      logoLight: FORGE_LOGO,
      logoDark: FORGE_LOGO
    },
    uxMode: 'popup',
    preset: 'DISALLOW_EXTERNAL_WALLETS'
  })
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
            if (!provider) devWarn('MetaMask connector not found!')
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
            const provider = window?.tally
            if (!provider) devWarn('Connector', 'Taho' || 'unknown', 'not found!')
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
            if (!provider) devWarn('Coinbase Wallet not found!')
            return provider
          } catch (error) {
            return undefined
          }
        }
      }
    }
  })
]
