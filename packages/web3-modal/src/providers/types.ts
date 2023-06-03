import { ConfigCtrlState } from '@web3modal/core'
import { Chain, EthereumClient } from '@web3modal/ethereum'
import { Web3ModalProps as Web3ModalConfigOriginal } from '@web3modal/react'

import { PstlWeb3ConnectionModalProps } from '../components/ConnectionModal'
import { PstlWeb3AuthConnectorProps } from '../connectors'
import { PstlWagmiClientOptions } from './utils'

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

export type ChainsPartialReadonly = DeepReadonly<Chain>[]

export type Web3ModalThemeVariables = {
  '--w3m-color-bg-1'?: string
  '--w3m-color-fg-1'?: string
} & Web3ModalConfigOriginal['themeVariables']

export type Web3ModalConfig<SC extends ChainsPartialReadonly = ChainsPartialReadonly> = Omit<
  ConfigCtrlState,
  'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'
> & {
  chains?: SC
  projectId: string
  w3aProjectId: string
  zIndex?: number
  themeVariables?: Web3ModalThemeVariables
}
export interface Web3ModalProps<SC extends ChainsPartialReadonly = ChainsPartialReadonly> {
  appName: string
  chains: SC
  wagmiClient?: PstlWagmiClientOptions
  ethereumClient?: EthereumClient
  modals: {
    pstl?: Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss'>
    w3m: Omit<Web3ModalConfig<any>, 'w3aProjectId' | 'chains'>
    w3a: Omit<PstlWeb3AuthConnectorProps, 'chains'>
  }
}

export type PstlWeb3ModalProps<SC extends ChainsPartialReadonly = ChainsPartialReadonly> = Web3ModalProps<SC>
export type PstlWeb3ProviderProps<SC extends ChainsPartialReadonly = ChainsPartialReadonly> = PstlWeb3ModalProps<SC>
