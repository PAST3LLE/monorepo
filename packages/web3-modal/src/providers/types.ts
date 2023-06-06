import { Address } from '@past3lle/types'
import { ConfigCtrlState } from '@web3modal/core'
import { EthereumClient } from '@web3modal/ethereum'
import { Web3ModalProps as Web3ModalConfigOriginal } from '@web3modal/react'

import { PstlWeb3ConnectionModalProps } from '../components/ConnectionModal'
import { PstlWeb3AuthConnectorProps } from '../connectors'
import { PstlWagmiClientOptions } from './utils'

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

type Contract = {
  address: Address
  blockCreated?: number
}

type RpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[]
}

type BlockExplorer = {
  name: string
  url: string
}

type NativeCurrency = {
  name: string
  /** 2-6 characters long */
  symbol: string
  decimals: number
}

type Chain<ID extends number> = {
  /** ID in number form */
  id: ID
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Currency used by chain */
  nativeCurrency: NativeCurrency
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: RpcUrls
    default: RpcUrls
    public: RpcUrls
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Collection of contracts */
  contracts?: {
    ensRegistry?: Contract
    ensUniversalResolver?: Contract
    multicall3?: Contract
  }
  /** Flag for test networks */
  testnet?: boolean
}

export type ChainsPartialReadonly<ID extends number> = DeepReadonly<Chain<ID>>[]

export type Web3ModalThemeVariables = {
  '--w3m-color-bg-1'?: string
  '--w3m-color-fg-1'?: string
} & Web3ModalConfigOriginal['themeVariables']

export type Web3ModalConfig<ID extends number, SC extends ChainsPartialReadonly<ID>> = Omit<
  ConfigCtrlState,
  'projectId' | 'enableStandaloneMode' | 'walletConnectVersion'
> & {
  chains?: SC
  projectId: string
  w3aProjectId: string
  zIndex?: number
  themeVariables?: Web3ModalThemeVariables
}
export interface Web3ModalProps<ID extends number, SC extends ChainsPartialReadonly<ID>> {
  appName: string
  chains: SC
  wagmiClient?: PstlWagmiClientOptions<ID, SC>
  ethereumClient?: EthereumClient
  modals: {
    pstl?: Omit<PstlWeb3ConnectionModalProps, 'isOpen' | 'onDismiss'>
    w3m: Omit<Web3ModalConfig<any, any>, 'w3aProjectId' | 'chains'>
    w3a: Omit<PstlWeb3AuthConnectorProps<ID>, 'chains'>
  }
}

export type PstlWeb3ModalProps<
  ID extends number,
  SC extends ChainsPartialReadonly<ID> = ChainsPartialReadonly<ID>
> = Web3ModalProps<ID, SC>
export type PstlWeb3ProviderProps<ID extends number, SC extends ChainsPartialReadonly<ID>> = PstlWeb3ModalProps<ID, SC>
