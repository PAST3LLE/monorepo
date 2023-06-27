import React, { ReactNode } from 'react'
import { WagmiConfig, WagmiConfigProps } from 'wagmi'

import { WagmiEagerConnect } from './WagmiEagerConnect'

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
    <WagmiEagerConnect chainIdFromUrl={chainIdFromUrl} persistOnRefresh={!!persistOnRefresh}>
      {children}
    </WagmiEagerConnect>
  </WagmiConfig>
)
