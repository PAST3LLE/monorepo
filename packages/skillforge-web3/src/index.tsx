import { PstlHooksProvider } from '@past3lle/hooks'
import CONTRACTS_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import packageJSON from '@past3lle/skilltree-contracts/package.json'
import {
  PstlModalTheme as ModalTheme,
  PstlW3Providers,
  usePstlEthereumClient as useEthereumClient,
  usePstlConnection as useW3Connection,
  usePstlWeb3Modal as useW3Modal,
  usePstlWagmiClient as useWagmiClient
} from '@past3lle/web3-modal'
import React, { ReactNode, StrictMode } from 'react'

import { SkillForgeBalancesUpdater, SkillForgeW3StateUpdaters, SkillForgeWindowSizeUpdater } from './state'
import { SkillForgeW3AppConfig } from './types'

// Utilities & Types & Contract Hooks
export * from './utils'
export * from './types'
export * from './hooks'
export * from './constants'

// State and Updaters
export * from './state'

// Skilltree-contracts version
const CONTRACTS_VERSIONS: string = packageJSON.version
export { CONTRACTS_VERSIONS, CONTRACTS_NETWORKS }

interface ForgeW3CoreProvidersProps {
  children: ReactNode
  config: SkillForgeW3AppConfig
}

function ForgeStateProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <PstlHooksProvider {...config.hooksProviderOptions}>
        <SkillForgeW3StateUpdaters {...config}>{children}</SkillForgeW3StateUpdaters>
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
          <SkillForgeW3StateUpdaters {...config}>{children}</SkillForgeW3StateUpdaters>
        </PstlW3Providers>
      </PstlHooksProvider>
    </StrictMode>
  )
}

function ForgeW3BalancesAndWindowSizeProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <PstlHooksProvider {...config.hooksProviderOptions}>
        <SkillForgeWindowSizeUpdater />
        <PstlW3Providers
          config={{
            ...config.web3,
            appName: config.name
          }}
        >
          <SkillForgeBalancesUpdater contractAddressMap={config.contractAddresses} />
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
  type ModalTheme,
  type ForgeW3CoreProvidersProps
}
