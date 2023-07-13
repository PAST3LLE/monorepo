import React, { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

import { SmartAutoConnectProps } from '../../hooks/useSmartAutoConnect'
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
