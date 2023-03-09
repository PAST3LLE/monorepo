import React, { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

import { ForgeW3WagmiClient } from '../utils'

export const ForgeW3WagmiProvider = ({
  children,
  wagmiClient
}: {
  children: ReactNode
  wagmiClient: ForgeW3WagmiClient
}) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
