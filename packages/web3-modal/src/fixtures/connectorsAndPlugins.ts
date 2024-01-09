import { LedgerHIDConnector } from '@past3lle/wagmi-connectors/LedgerHIDConnector'
import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
import { PstlWeb3AuthConnector } from '@past3lle/wagmi-connectors/PstlWeb3AuthConnector'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'

// Removing post Ledger supply-chain attack
// import { LedgerConnector } from 'wagmi/connectors/'
import { ReadonlyChain } from '../providers'
import { addConnector } from '../providers/utils'
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
  // ledgerLiveModal: addConnector(LedgerConnector, {
  //   enableDebugLogs: false,
  //   walletConnectVersion: 2,
  //   projectId: WALLETCONNECT_ID,
  //   requiredChains: [1]
  // }),
  ledgerHID: addConnector(LedgerHIDConnector, {}),
  ledgerIFrame: addConnector(LedgerIFrameConnector, {}),
  // Can also instantiate like this.
  // addConnector is just syntactic sugar
  // PstlWeb3AuthConnector requires this instantiation
  web3auth: (chains: ReadonlyChain<number>[]) => {
    if (typeof process.env.REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID !== 'string') {
      throw new Error('Missing REACT_APP_WEB3AUTH_DEVNET_CLIENT_ID!')
    }
    return PstlWeb3AuthConnector(chains, {
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
}
