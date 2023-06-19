import React, { ReactNode } from 'react'
import { WagmiConfig, WagmiConfigProps } from 'wagmi'

import { WagmiEagerConnect } from './WagmiEagerConnect'

export const PstlWagmiProvider = ({
  persistOnRefresh,
  children,
  wagmiClient
}: {
  persistOnRefresh?: boolean
  children: ReactNode
  wagmiClient: WagmiConfigProps['client']
}) => (
  <WagmiConfig client={wagmiClient}>
    <WagmiEagerConnect persistOnRefresh={!!persistOnRefresh}>{children}</WagmiEagerConnect>
  </WagmiConfig>
)
