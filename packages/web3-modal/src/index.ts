import { PstlWeb3Modal } from './components/modals'
import {
  useAccountNetworkActions as usePstlAccountNetworkActions,
  useConnectDisconnect as usePstlConnectDisconnect,
  useConnection as usePstlConnection,
  useUserConnectionInfo as usePstlUserConnectionInfo,
  usePstlWeb3Modal,
  useWeb3Modals as usePstlWeb3Modals
} from './hooks'

export * from './types'

import {
  getAllChainsInfo,
  getChainInfoFromShortName,
  getSafeAppChainInfo,
  getSafeAppChainShortName
} from './utils/chains'

import {
  createTheme,
  W3aStyleResetProvider,
  type PstlModalThemeExtension,
  type PstlModalTheme,
} from './theme'

import {
  PstlW3Providers,
  PstlWagmiProvider,
  usePstlEthereumClient,
  usePstlWagmiClient,
  addConnector,
  addFrameConnector,
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly,
  type ReadonlyChain,
  type Chain
} from './providers'

import { getAppType, AppType } from './providers/utils/connectors'

export {
  PstlWeb3Modal,
  usePstlAccountNetworkActions,
  usePstlConnectDisconnect,
  usePstlConnection,
  usePstlUserConnectionInfo,
  usePstlWeb3Modal,
  usePstlWeb3Modals,
  // theme
  createTheme,
  W3aStyleResetProvider,
  // providers
  PstlW3Providers,
  PstlWagmiProvider,
  // hooks
  usePstlEthereumClient,
  usePstlWagmiClient,
  // utils
  getAllChainsInfo,
  getChainInfoFromShortName,
  getSafeAppChainInfo,
  getSafeAppChainShortName,
  addConnector,
  addFrameConnector,
  getAppType,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly,
  type ReadonlyChain,
  type Chain,
  type PstlModalThemeExtension,
  type PstlModalTheme,
  type AppType
}