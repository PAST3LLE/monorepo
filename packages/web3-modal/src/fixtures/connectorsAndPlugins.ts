import { IFrameEthereumConnector, LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import { Connector } from '@wagmi/connectors'
import { LedgerConnector } from '@wagmi/connectors/ledger'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'

import { chains } from './chains'
import { WALLETCONNECT_ID, WEB3AUTH_TEST_ID } from './config'

const TORUS_LOGO = 'https://web3auth.io/docs/contents/logo-ethereum.png'
const torusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {
    buttonPosition: 'bottom-right',
    apiKey: WEB3AUTH_TEST_ID
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

const ledgerLiveModal = new LedgerConnector({
  chains,
  options: {
    enableDebugLogs: false,
    walletConnectVersion: 2,
    projectId: WALLETCONNECT_ID,
    requiredChains: [1]
  }
})

export const w3aPlugins = {
  torusPlugin
}

export const wagmiConnectors = {
  ledgerLiveModal,
  ledgerHID: new LedgerHIDConnector() as unknown as Connector<LedgerHIDConnector['provider'], any>,
  ledgerIFrame: new IFrameEthereumConnector({ chains, options: {} })
}

export const wagmiConnectorsList = Object.values(wagmiConnectors) as Connector<any, any>[]
