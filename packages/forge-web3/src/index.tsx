import { PstlHooksProvider } from '@past3lle/hooks'
import {
  type ChainsPartialReadonly,
  PstlModalTheme as ForgeModalTheme,
  PstlW3Providers,
  W3aStyleResetProvider,
  addConnector,
  addFrameConnector,
  usePstlEthereumClient as useEthereumClient,
  usePstlConnection as useW3Connection,
  usePstlWeb3Modal as useW3Modal,
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
      <PstlHooksProvider {...config.hooksProviderOptions}>
        <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
      </PstlHooksProvider>
    </StrictMode>
  )
}

function ForgeW3Providers({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <PstlHooksProvider {...config.hooksProviderOptions}>
        <PstlW3Providers
          config={{
            ...config.web3,
            appName: config.name
          }}
        >
          <W3aStyleResetProvider />
          <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
        </PstlW3Providers>
      </PstlHooksProvider>
    </StrictMode>
  )
}

function ForgeW3BalancesAndWindowSizeProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <PstlHooksProvider {...config.hooksProviderOptions}>
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
      </PstlHooksProvider>
    </StrictMode>
  )
}

export {
  ForgeW3Providers,
  ForgeStateProviders,
  ForgeW3BalancesAndWindowSizeProviders,
  useW3Connection,
  useW3Modal,
  useEthereumClient,
  useWagmiClient,
  addConnector,
  addFrameConnector,
  type ForgeModalTheme,
  type ForgeW3CoreProvidersProps,
  type ChainsPartialReadonly
}
