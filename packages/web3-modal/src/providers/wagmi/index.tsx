import React, { ReactNode } from 'react'
import { SmartAutoConnectProps } from 'src/hooks/useSmartAutoConnect'
import { WagmiConfig } from 'wagmi'

import { WagmiClient } from '../utils'
import { SmartConnect } from './SmartConnect'

interface WagmiProviderProps extends SmartAutoConnectProps {
  children: ReactNode
  wagmiClient: WagmiClient
}

export const PstlWagmiProvider = ({ children, wagmiClient, ...smartConnectProps }: WagmiProviderProps) => (
  <WagmiConfig config={wagmiClient}>
    <SmartConnect {...smartConnectProps} />
    {children}
  </WagmiConfig>
)
