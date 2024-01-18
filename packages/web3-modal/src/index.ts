import { TransactionsButton as PstlTransactionsButton } from './components/buttons/Transactions'
import { PstlWeb3Modal } from './components/modals'
import { AnyTransactionReceipt, TransactionOptions, TransactionStatus } from './controllers/TransactionsCtrl/types'
import {
  useAddPendingTransaction,
  useAddPendingTransactionsBatch,
  useAllWeb3Modals,
  useFindTransactionByMetadataKeyValue,
  useFindTransactionByMetadataKeyValueCallback,
  useHasPendingTransactions,
  useIsSafeViaWc,
  useIsSafeWallet,
  useLimitChainsAndSwitchCallback,
  usePendingEoaTransactions,
  usePendingSafeTransactions,
  usePendingTransactions,
  useAccountNetworkActions as usePstlAccountNetworkActions,
  useConnectDisconnect as usePstlConnectDisconnect,
  useConnection as usePstlConnection,
  useModalActions as usePstlModalActions,
  useUserConnectionInfo as usePstlUserConnectionInfo,
  useWaitForTransaction as usePstlWaitForTransaction,
  useWatchPendingTransactions as usePstlWatchPendingTransactions,
  usePstlWeb3Modal,
  useAllWeb3Modals as usePstlWeb3Modals,
  useTransactionsByMetadataKey,
  useTransactionsByMetadataKeyCallback,
  useTransactionsRead
} from './hooks'
import {
  PstlW3Providers,
  type PstlWagmiClientOptions,
  PstlWagmiProvider,
  type PstlWeb3ModalProps,
  useCreateWagmiClient
} from './providers'
import { AppType, getAppType, useDeriveAppType } from './utils/connectors'
import { type PstlModalTheme, type PstlModalThemeExtension, W3aStyleResetProvider, createTheme } from './theme'
import {
  getAllChainsInfo,
  getChainInfoFromShortName,
  getSafeAppChainInfo,
  getSafeAppChainShortName
} from './utils/chains'

export * from './types'

export {
  PstlWeb3Modal,
  PstlTransactionsButton,
  // hooks
  usePstlAccountNetworkActions,
  usePstlConnectDisconnect,
  usePstlConnection,
  usePstlModalActions,
  usePstlUserConnectionInfo,
  usePstlWeb3Modal,
  usePstlWeb3Modals,
  useAllWeb3Modals,
  usePstlWaitForTransaction,
  useLimitChainsAndSwitchCallback,
  usePstlWatchPendingTransactions,
  useIsSafeWallet,
  useIsSafeViaWc,
  // txs
  useAddPendingTransaction,
  useAddPendingTransactionsBatch,
  useHasPendingTransactions,
  usePendingTransactions,
  usePendingEoaTransactions,
  usePendingSafeTransactions,
  useTransactionsRead,
  useTransactionsByMetadataKey,
  useTransactionsByMetadataKeyCallback,
  useFindTransactionByMetadataKeyValue,
  useFindTransactionByMetadataKeyValueCallback,
  // theme
  createTheme,
  W3aStyleResetProvider,
  // providers
  PstlW3Providers,
  PstlWagmiProvider,
  // hooks
  // usePstlEthereumClient,
  useCreateWagmiClient,
  // utils
  getAllChainsInfo,
  getChainInfoFromShortName,
  getSafeAppChainInfo,
  getSafeAppChainShortName,
  getAppType,
  useDeriveAppType,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type PstlModalThemeExtension,
  type PstlModalTheme,
  type AppType,
  type AnyTransactionReceipt,
  type TransactionStatus,
  type TransactionOptions
}
