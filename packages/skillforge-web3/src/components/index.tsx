import React, { ReactNode, StrictMode } from 'react'

import { SkillForgeW3Providers } from '../providers'
import { SkillForgeW3StateUpdaters } from '../state/Combined/updaters'
import { SkillForgeW3AppConfig } from '../types'

interface ForgeW3CoreProvidersProps {
  children: ReactNode
  config: SkillForgeW3AppConfig
}

function ForgeW3DataProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <SkillForgeW3StateUpdaters {...config}>{children}</SkillForgeW3StateUpdaters>
    </StrictMode>
  )
}

function ForgeW3ConnectedProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <SkillForgeW3Providers
        walletconnectConfig={{
          appName: config.name,
          walletConnect: config.web3.walletconnectProvider
        }}
      >
        <SkillForgeW3StateUpdaters {...config}>{children}</SkillForgeW3StateUpdaters>
      </SkillForgeW3Providers>
    </StrictMode>
  )
}

export { type ForgeW3CoreProvidersProps, ForgeW3DataProviders, ForgeW3ConnectedProviders }
