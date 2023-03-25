import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'
import { Web3ModalConfig as Web3ModalConfigOriginal } from '@web3modal/standalone'

import { PstlWeb3AuthConnectorProps } from '../connectors'
import { PstlW3WagmiClientOptions } from './utils'

export type Web3ModalConfig = Omit<ConfigCtrlState, 'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains: Chain[]
  w3mId: string
  w3aId: string
  themeVariables?: Web3ModalConfigOriginal['themeVariables']
}

export interface Web3ModalProps {
  appName: string
  web3Modal: Web3ModalConfig
  web3Auth: PstlWeb3AuthConnectorProps
  wagmiClient?: PstlW3WagmiClientOptions
  ethereumClient?: EthereumClient
}

export type PstlW3ProviderProps = Web3ModalProps
export type PstlWeb3ProviderProps = PstlW3ProviderProps
