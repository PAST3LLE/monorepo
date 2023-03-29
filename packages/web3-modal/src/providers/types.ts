import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'
import { Web3ModalProps as Web3ModalConfigOriginal } from '@web3modal/react'

import { PstlWeb3ConnectionModalProps } from '../components/ConnectionModal'
import { PstlWeb3AuthConnectorProps } from '../connectors'
import { PstlWagmiClientOptions } from './utils'

export type Web3ModalThemeVariables = {
  '--w3m-color-bg-1'?: string
  '--w3m-color-fg-1'?: string
} & Web3ModalConfigOriginal['themeVariables']

export type Web3ModalConfig = Omit<ConfigCtrlState, 'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'> & {
  chains?: Chain[]
  projectId: string
  w3aProjectId: string
  zIndex?: number
  themeVariables?: Web3ModalThemeVariables
}
export interface Web3ModalProps {
  appName: string
  chains: Chain[]
  wagmiClient?: PstlWagmiClientOptions
  ethereumClient?: EthereumClient
  modals: {
    pstl?: Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss'>
    w3m: Omit<Web3ModalConfig, 'w3aProjectId'>
    w3a: Omit<PstlWeb3AuthConnectorProps, 'chains'> & { chains?: Chain[] }
  }
}

export type PstlWeb3ModalProps = Web3ModalProps
export type PstlWeb3ProviderProps = PstlWeb3ModalProps
