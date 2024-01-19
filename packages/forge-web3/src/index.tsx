import {
  type AnyTransactionReceipt,
  AppType,
  PstlModalTheme as ForgeModalTheme,
  PstlW3Providers,
  type TransactionOptions,
  type TransactionStatus,
  W3aStyleResetProvider,
  createTheme,
  getAppType,
  useDeriveAppType,
  usePstlAccountNetworkActions as useW3AccountNetworkActions,
  usePstlConnectDisconnect as useW3ConnectDisconnect,
  usePstlConnection as useW3Connection,
  useCreateWagmiClient as useW3CreateWagmiClient,
  useFindTransactionByMetadataKeyValue as useW3FindTransactionByMetadataKeyValue,
  useFindTransactionByMetadataKeyValueCallback as useW3FindTransactionByMetadataKeyValueCallback,
  usePstlWeb3Modal as useW3Modal,
  usePstlWeb3Modals as useW3Modals,
  useTransactionsByMetadataKey as useW3TransactionsByMetadataKey,
  useTransactionsByMetadataKeyCallback as useW3TransactionsByMetadataKeyCallback,
  useTransactionsRead as useW3TransactionsRead,
  usePstlUserConnectionInfo as useW3UserConnectionInfo,
  usePstlWaitForTransaction as useW3WaitForTransaction,
  usePstlWaitForTransactionEffect as useW3WaitForTransactionEffect
} from '@past3lle/web3-modal'
import React, { ReactNode } from 'react'

import { ForgeBalancesUpdater, ForgeW3StateUpdaters, ForgeWindowSizeUpdater } from './state'
import { ForgeChainsMinimum, ForgeW3AppConfig } from './types'

// Utilities & Types & Contract Hooks
export * from './utils'
export * from './types'
export * from './hooks'
export * from './constants'

// State and Updaters
export * from './state'

interface ForgeW3CoreProvidersProps<forgeChains extends ForgeChainsMinimum> {
  children: ReactNode
  config: ForgeW3AppConfig<forgeChains>
}

function ForgeStateProviders<forgeChains extends ForgeChainsMinimum>({
  config,
  children
}: ForgeW3CoreProvidersProps<forgeChains>) {
  return <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
}

function ForgeW3Providers<forgeChains extends ForgeChainsMinimum>({
  config,
  children
}: ForgeW3CoreProvidersProps<forgeChains>) {
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

function ForgeW3BalancesAndWindowSizeProviders<forgeChains extends ForgeChainsMinimum>({
  config,
  children
}: ForgeW3CoreProvidersProps<forgeChains>) {
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
  useW3CreateWagmiClient,
  useW3WaitForTransaction,
  useW3WaitForTransactionEffect,
  getAppType,
  useDeriveAppType,
  createTheme as createWeb3ModalTheme,
  type AnyTransactionReceipt,
  type AppType,
  type ForgeModalTheme,
  type ForgeW3CoreProvidersProps,
  type TransactionStatus,
  type TransactionOptions
}
