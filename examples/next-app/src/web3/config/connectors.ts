import { LedgerHIDConnector } from '@past3lle/wagmi-connectors/LedgerHIDConnector'
import { addConnector } from '@past3lle/web3-modal'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { WALLETCONNECT_CONFIG } from './walletconnect'

export const CONNECTORS_CONFIG = [
  addConnector(LedgerConnector, {
    projectId: WALLETCONNECT_CONFIG['projectId'],
    walletConnectVersion: 2
  }),
  addConnector(MetaMaskConnector, {
    name: 'MetaMask',
    shimDisconnect: true,
    getProvider() {
      if (typeof global?.window === undefined) return undefined
      return global.window?.ethereum?.providerMap?.get('MetaMask') || global.window?.ethereum
    }
  }),
  addConnector(InjectedConnector, {
    name: 'CoinbaseWallet',
    shimDisconnect: true,
    getProvider() {
      if (typeof global.window === undefined) return undefined
      return global.window?.coinbaseWalletExtension
    }
  }),
  addConnector(InjectedConnector, {
    name: 'Taho',
    shimDisconnect: true,
    getProvider() {
      if (typeof global.window === undefined) return undefined
      return global.window?.tally
    }
  }),
  addConnector(LedgerHIDConnector, undefined)
]
