import React, { ReactNode, StrictMode } from 'react'

import { ForgeW3Providers } from '../providers'
import { ForgeW3StateUpdaters } from '../state/Combined/updaters'
import { ForgeW3AppConfig } from '../types'

interface ForgeW3CoreProvidersProps {
  children: ReactNode
  config: ForgeW3AppConfig
}

function ForgeW3DataProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
    </StrictMode>
  )
}

function ForgeW3ConnectedProviders({ config, children }: ForgeW3CoreProvidersProps) {
  return (
    <StrictMode>
      <ForgeW3Providers
        standalone={config.web3.standalone}
        walletconnectConfig={{
          appName: config.name,
          walletConnect: config.web3.walletconnectProvider
        }}
      >
        <ForgeW3StateUpdaters {...config}>{children}</ForgeW3StateUpdaters>
      </ForgeW3Providers>
    </StrictMode>
  )
}

export { type ForgeW3CoreProvidersProps, ForgeW3DataProviders, ForgeW3ConnectedProviders }
