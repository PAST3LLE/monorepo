import React, { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

import { SmartAutoConnectProps } from '../../hooks/internal/useSmartAutoConnect'
import { WagmiClient } from '../utils'
import { ConnectedUpdaters } from './ConnectedUpdaters'

interface WagmiProviderProps extends SmartAutoConnectProps {
  children: ReactNode
  wagmiClient: WagmiClient
}

export const PstlWagmiProvider = ({ children, wagmiClient, ...smartConnectProps }: WagmiProviderProps) => (
  <WagmiConfig config={wagmiClient}>
    <ConnectedUpdaters {...smartConnectProps} />
    {children}
  </WagmiConfig>
)
