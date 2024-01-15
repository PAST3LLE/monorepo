import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'

import { SmartAutoConnectProps } from '../../hooks/internal/useSmartAutoConnect'
import { WagmiClient } from '../utils'
import { ConnectedUpdaters } from './ConnectedUpdaters'

const queryClient = new QueryClient()

interface WagmiProviderProps extends SmartAutoConnectProps {
  children: ReactNode
  wagmiClient: WagmiClient
}

export const PstlWagmiProvider = ({ children, wagmiClient, ...smartConnectProps }: WagmiProviderProps) => (
  <WagmiProvider config={wagmiClient}>
    <QueryClientProvider client={queryClient}>
      <ConnectedUpdaters {...smartConnectProps} />
      {children}
    </QueryClientProvider>
  </WagmiProvider>
)
