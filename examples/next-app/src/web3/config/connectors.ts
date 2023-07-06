import { addConnector } from "@past3lle/web3-modal"
import { LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { WALLETCONNECT_CONFIG } from "./walletconnect"

export const CONNECTORS_CONFIG = [
    addConnector(LedgerConnector, {
        options: { 
            projectId: WALLETCONNECT_CONFIG['projectId'], 
            walletConnectVersion: 2 
        }
    }),
    addConnector(MetaMaskConnector, {
        options: {
            name: 'MetaMask',
            shimDisconnect: true,
            getProvider() {
                if (typeof global?.window === undefined) return undefined
                return global.window?.ethereum?.providerMap?.get('MetaMask') || global.window?.ethereum
            }
        }
    }),
    addConnector(InjectedConnector, {
        options: {
            name: 'CoinbaseWallet',
            shimDisconnect: true,
            getProvider() {
                if (typeof global.window === undefined) return undefined
                return global.window?.coinbaseWalletExtension 
            }
        }
    }),
    addConnector(InjectedConnector, {
        options: {
            name: 'Taho',
            shimDisconnect: true,
            getProvider() {
                if (typeof global.window === undefined) return undefined
                return global.window?.tally
            }
        }
    }),
    addConnector(LedgerHIDConnector, {})
]