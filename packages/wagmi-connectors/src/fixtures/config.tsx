import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { http } from 'viem'
import { WagmiProvider, createConfig } from 'wagmi'

import { ledgerHid } from '../ledgerHid'
import { chains } from './chains'

const queryClient = new QueryClient()

interface WagmiProviderProps {
  children: ReactNode
}
const WAGMI_CLIENT = createConfig({
  chains,
  connectors: [ledgerHid({ shimDisconnect: true })],
  transports: {
    1: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_GOERLI_API_KEY as string}`),
    5: http(`https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_GOERLI_API_KEY as string}`),
    137: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_MATIC_API_KEY as string}`),
    80001: http(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_MUMBAI_API_KEY as string}`)
  }
})
const CosmosWagmiProvider = ({ children }: WagmiProviderProps) => {
  return (
    <WagmiProvider config={WAGMI_CLIENT}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export { CosmosWagmiProvider }
