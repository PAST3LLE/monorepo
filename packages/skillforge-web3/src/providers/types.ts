import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'

import { SkillForgeW3WagmiClientOptions } from './utils'

export type Web3ModalConfig = Omit<ConfigCtrlState, 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains: Chain[]
}

export interface Web3ModalProps {
  appName: string
  web3Modal: Web3ModalConfig
  wagmiClient?: SkillForgeW3WagmiClientOptions
  ethereumClient?: EthereumClient
}

export type SkillForgeW3ProviderProps = Web3ModalProps
export type SkillForgeWeb3ProviderProps = SkillForgeW3ProviderProps
