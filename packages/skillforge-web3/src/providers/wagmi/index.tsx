import React, { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

import { SkillForgeW3WagmiClient } from '../utils'

export const SkillForgeW3WagmiProvider = ({
  children,
  wagmiClient
}: {
  children: ReactNode
  wagmiClient: SkillForgeW3WagmiClient
}) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
