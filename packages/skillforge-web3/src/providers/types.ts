import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'

import { SkillForgeW3WagmiClient } from './utils'

export type Web3ModalConfig = Omit<ConfigCtrlState, 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains: Chain[]
}

export interface WalletConnectProps {
  appName: string
  walletConnect: Web3ModalConfig
  wagmiClient?: SkillForgeW3WagmiClient
  ethereumClient?: EthereumClient
}

export type SkillForgeW3ProviderProps = WalletConnectProps
export type SkillForgeWeb3ProviderProps = SkillForgeW3ProviderProps
