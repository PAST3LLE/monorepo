import { WindowSizeProvider } from '@past3lle/hooks'
import {
  AppType,
  type ChainsPartialReadonly,
  PstlModalTheme as ForgeModalTheme,
  PstlW3Providers,
  W3aStyleResetProvider,
  addConnector,
  addFrameConnector,
  getAppType,
  usePstlEthereumClient as useEthereumClient,
  usePstlAccountNetworkActions as useW3AccountNetworkActions,
  usePstlConnectDisconnect as useW3ConnectDisconnect,
  usePstlConnection as useW3Connection,
  usePstlWeb3Modal as useW3Modal,
  usePstlWeb3Modals as useW3Modals,
  usePstlUserConnectionInfo as useW3UserConnectionInfo,
  usePstlWagmiClient as useWagmiClient
} from '@past3lle/web3-modal'
import React, { ReactNode, StrictMode } from 'react'

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
  return (
    <StrictMode>
      <WindowSizeProvider {...config.hooksProviderOptions}>
        <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
      </WindowSizeProvider>
    </StrictMode>
  )
}

function ForgeW3Providers({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <WindowSizeProvider {...config.hooksProviderOptions}>
        <PstlW3Providers
          config={{
            ...config.web3,
            appName: config.name
          }}
        >
          <W3aStyleResetProvider />
          <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
        </PstlW3Providers>
      </WindowSizeProvider>
    </StrictMode>
  )
}

function ForgeW3BalancesAndWindowSizeProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <WindowSizeProvider {...config.hooksProviderOptions}>
        <ForgeWindowSizeUpdater />
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
      </WindowSizeProvider>
    </StrictMode>
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
  useEthereumClient,
  useWagmiClient,
  addConnector,
  addFrameConnector,
  getAppType,
  AppType,
  type ForgeModalTheme,
  type ForgeW3CoreProvidersProps,
  type ChainsPartialReadonly
}
