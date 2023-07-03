import React, { ReactNode } from 'react'
import { WagmiConfig, WagmiConfigProps } from 'wagmi'

import { AutoconnectUpdater } from './AutoconnectUpdater'

export const PstlWagmiProvider = ({
  chainIdFromUrl,
  persistOnRefresh,
  children,
  wagmiClient
}: {
  chainIdFromUrl: number | undefined
  persistOnRefresh?: boolean
  children: ReactNode
  wagmiClient: WagmiConfigProps['config']
}) => (
  <WagmiConfig config={wagmiClient}>
    <AutoconnectUpdater chainIdFromUrl={chainIdFromUrl} persistOnRefresh={!!persistOnRefresh} />
    {children}
  </WagmiConfig>
)
