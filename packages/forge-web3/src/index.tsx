import {
  type AnyTransactionReceipt,
  AppType,
  type ChainsPartialReadonly,
  PstlModalTheme as ForgeModalTheme,
  PstlW3Providers,
  type TransactionOptions,
  type TransactionStatus,
  W3aStyleResetProvider,
  addConnector,
  addFrameConnector,
  createTheme,
  getAppType,
  useDeriveAppType,
  usePstlEthereumClient as useEthereumClient,
  usePstlAccountNetworkActions as useW3AccountNetworkActions,
  usePstlConnectDisconnect as useW3ConnectDisconnect,
  usePstlConnection as useW3Connection,
  useFindTransactionByMetadataKeyValue as useW3FindTransactionByMetadataKeyValue,
  useFindTransactionByMetadataKeyValueCallback as useW3FindTransactionByMetadataKeyValueCallback,
  usePstlWeb3Modal as useW3Modal,
  usePstlWeb3Modals as useW3Modals,
  useTransactionsByMetadataKey as useW3TransactionsByMetadataKey,
  useTransactionsByMetadataKeyCallback as useW3TransactionsByMetadataKeyCallback,
  useTransactionsRead as useW3TransactionsRead,
  usePstlUserConnectionInfo as useW3UserConnectionInfo,
  usePstlWagmiClient as useWagmiClient
} from '@past3lle/web3-modal'
import React, { ReactNode } from 'react'

import { ForgeBalancesUpdater, ForgeW3StateUpdaters, ForgeWindowSizeUpdater } from './state'
import { ForgeW3AppConfig } from './types'

// Utilities & Types & Contract Hooks
export * from './utils'
export * from './types'
export * from './hooks'
export * from './constants'

// State and Updaters
export * from './state'

interface ForgeW3CoreProvidersProps {
  children: ReactNode
  config: ForgeW3AppConfig
}

function ForgeStateProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
}

function ForgeW3Providers({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <PstlW3Providers
      config={{
        ...config.web3,
        appName: config.name
      }}
    >
      <W3aStyleResetProvider />
      <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
    </PstlW3Providers>
  )
}

function ForgeW3BalancesAndWindowSizeProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <>
      <ForgeWindowSizeUpdater {...config.options?.windowSizeOptions} />
      <PstlW3Providers
        config={{
          ...config.web3,
          appName: config.name
        }}
      >
        <W3aStyleResetProvider />
        <ForgeBalancesUpdater />
        {children}
      </PstlW3Providers>
    </>
  )
}

export {
  ForgeW3Providers,
  ForgeStateProviders,
  ForgeW3BalancesAndWindowSizeProviders,
  useW3Connection,
  useW3ConnectDisconnect,
  useW3Modal,
  useW3Modals,
  useW3UserConnectionInfo,
  useW3AccountNetworkActions,
  useW3TransactionsRead,
  useW3FindTransactionByMetadataKeyValue,
  useW3FindTransactionByMetadataKeyValueCallback,
  useW3TransactionsByMetadataKey,
  useW3TransactionsByMetadataKeyCallback,
  useEthereumClient,
  useWagmiClient,
  addConnector,
  addFrameConnector,
  getAppType,
  useDeriveAppType,
  createTheme as createWeb3ModalTheme,
  type AnyTransactionReceipt,
  type AppType,
  type ForgeModalTheme,
  type ForgeW3CoreProvidersProps,
  type ChainsPartialReadonly,
  type TransactionStatus,
  type TransactionOptions
}
