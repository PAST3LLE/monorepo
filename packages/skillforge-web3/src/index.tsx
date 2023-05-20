import { PstlHooksProvider } from '@past3lle/hooks'
import CONTRACTS_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import packageJSON from '@past3lle/skilltree-contracts/package.json'
import { PstlW3Providers } from '@past3lle/web3-modal'
import React, { ReactNode, StrictMode } from 'react'

import { SkillForgeW3StateUpdaters } from './state/Combined/updaters'
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

function ForgeW3DataProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <PstlHooksProvider {...config.hooksProviderOptions}>
        <SkillForgeW3StateUpdaters {...config}>{children}</SkillForgeW3StateUpdaters>
      </PstlHooksProvider>
    </StrictMode>
  )
}

function ForgeW3ConnectedProviders({ config, children }: ForgeW3CoreProvidersProps) {
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

export { type ForgeW3CoreProvidersProps, ForgeW3DataProviders, ForgeW3ConnectedProviders }
