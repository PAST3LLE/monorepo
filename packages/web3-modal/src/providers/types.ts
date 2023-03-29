import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'
import { Web3ModalConfig as Web3ModalConfigOriginal } from '@web3modal/standalone'

import { PstlWeb3ConnectionModalProps } from '../components/ConnectionModal'
import { PstlWeb3AuthConnectorProps } from '../connectors'
import { PstlWagmiClientOptions } from './utils'

export type Web3ModalConfig = Omit<ConfigCtrlState, 'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains?: Chain[]
  w3mId: string
  w3aId: string
  zIndex?: number
  themeVariables?: Web3ModalConfigOriginal['themeVariables']
}

export interface Web3ModalProps {
  appName: string
  chains: Chain[]
  wagmiClient?: PstlWagmiClientOptions
  ethereumClient?: EthereumClient
  modals: {
    pstl?: Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss'>
    w3m: Omit<Web3ModalConfig, 'w3aId'>
    w3a: Omit<PstlWeb3AuthConnectorProps, 'chains'> & { chains?: Chain[] }
  }
}

export type PstlW3ProviderProps = Web3ModalProps
export type PstlWeb3ProviderProps = PstlW3ProviderProps
