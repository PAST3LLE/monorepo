import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'

import { ForgeW3WagmiClient } from './utils'

export type Web3ModalConfig = Omit<ConfigCtrlState, 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains: Chain[]
}

export interface WalletConnectProps {
  appName: string
  walletConnect: Web3ModalConfig
  wagmiClient?: ForgeW3WagmiClient
  ethereumClient?: EthereumClient
}

export type ForgeW3ProviderProps = WalletConnectProps
export type ForgeWeb3ProviderProps = ForgeW3ProviderProps
