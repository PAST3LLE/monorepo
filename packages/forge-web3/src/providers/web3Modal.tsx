import { ConfigCtrlState } from '@web3modal/core'
import { Chain, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'

export type Web3ModalConfig = Omit<
  ConfigCtrlState,
  'enableStandaloneMode' | 'standaloneChains' | 'walletConnectVersion'
> & {
  chains: Chain[]
}

export interface WalletConnectProps {
  appName: string
  walletConnect: Web3ModalConfig
}

// Web3Modal Ethereum Client
export const createWagmiClient = (props: WalletConnectProps) =>
  createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: props.walletConnect.projectId,
      version: '2',
      appName: props.appName,
      chains: props.walletConnect.chains
    }),
    provider: configureChains(props.walletConnect.chains, [
      walletConnectProvider({ projectId: props.walletConnect.projectId })
    ]).provider
  })
