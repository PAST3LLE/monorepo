import { LedgerHIDConnector } from '@past3lle/wagmi-connectors/LedgerHIDConnector'
import { LedgerIFrameConnector } from '@past3lle/wagmi-connectors/LedgerIFrameConnector'
import { PstlWeb3AuthConnector } from '@past3lle/wagmi-connectors/PstlWeb3AuthConnector'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'
import { LedgerConnector } from 'wagmi/connectors/ledger'

import { ReadonlyChain } from '../providers'
import { addConnector } from '../providers/utils'
import { FORGE_LOGO, WALLETCONNECT_ID, WEB3AUTH_TEST_ID } from './config'

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

export const w3aPlugins = {
  torusPlugin
}

export const wagmiConnectors = {
  ledgerLiveModal: addConnector(LedgerConnector, {
    enableDebugLogs: false,
    walletConnectVersion: 2,
    projectId: WALLETCONNECT_ID,
    requiredChains: [1]
  }),
  ledgerHID: addConnector(LedgerHIDConnector, {}),
  ledgerIFrame: addConnector(LedgerIFrameConnector, {}),
  // Can also instantiate like this.
  // addConnector is just syntactic sugar
  // PstlWeb3AuthConnector requires this instantiation
  web3auth: (chains: ReadonlyChain<number>[]) =>
    PstlWeb3AuthConnector(chains, {
      appName: 'SKILLFORGE TEST',
      projectId: WEB3AUTH_TEST_ID,
      network: 'cyan',
      listingName: 'GOOGLE & MORE',
      appLogoLight: FORGE_LOGO,
      appLogoDark: FORGE_LOGO,
      uxMode: 'redirect',
      preset: 'DISALLOW_EXTERNAL_WALLETS'
      // zIndex: 901
    })
}
