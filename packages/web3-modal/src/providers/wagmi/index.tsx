import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, memo } from 'react'
import { Chain } from 'viem'
import { Connector, WagmiProvider } from 'wagmi'

import { SmartAutoConnectProps } from '../../hooks/internal/useSmartAutoConnect'
import { WagmiClient } from '../../hooks/internal/useCreateWagmiClient'
import { ConnectedUpdaters } from './ConnectedUpdaters'

const queryClient = new QueryClient()

interface WagmiProviderProps extends SmartAutoConnectProps {
  children: ReactNode
  wagmiClient: WagmiClient
}

export const PstlWagmiProvider = memo(
  ({ children, wagmiClient, autoConnect }: WagmiProviderProps) => (
    <WagmiProvider config={wagmiClient} reconnectOnMount={!!autoConnect}>
      <QueryClientProvider client={queryClient}>
        <ConnectedUpdaters /* {...smartConnectProps} */ />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  ),
  (prev, next) => {
    // Memo provider and check manually pertinent prop change status
    // Prevents unnecessary re-renders
    const propsEqual =
      prev?.autoConnect === next?.autoConnect || _connectorsEqual(prev, next) || _chainsEqual(prev, next)
    return propsEqual
  }
)

function _serialiseConnectorsByUid(connectors: readonly Connector[]) {
  return JSON.stringify(connectors.map((cc) => cc.uid))
}

function _serialiseChainsById(chains: readonly Chain[]) {
  return JSON.stringify(chains.map((cc) => cc.id))
}

function _connectorsEqual(prev: Readonly<WagmiProviderProps>, next: Readonly<WagmiProviderProps>) {
  return (
    _serialiseConnectorsByUid(prev.wagmiClient.connectors) === _serialiseConnectorsByUid(next.wagmiClient.connectors)
  )
}

function _chainsEqual(prev: Readonly<WagmiProviderProps>, next: Readonly<WagmiProviderProps>) {
  return _serialiseChainsById(prev.wagmiClient.chains) === _serialiseChainsById(next.wagmiClient.chains)
}
