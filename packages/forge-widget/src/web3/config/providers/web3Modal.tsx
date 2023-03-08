import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'

import { AppConfig } from '../../../types'
import { SUPPORTED_CHAINS } from '../chains'

export interface WalletConnectProps {
  appName: AppConfig['appName']
  walletConnect: {
    projectId: string
  }
}

// Web3Modal Ethereum Client
export const createWagmiClient = (props: WalletConnectProps) =>
  createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: props.walletConnect.projectId,
      version: '2',
      appName: props.appName,
      chains: SUPPORTED_CHAINS
    }),
    provider: configureChains(SUPPORTED_CHAINS, [walletConnectProvider({ projectId: props.walletConnect.projectId })])
      .provider
  })
