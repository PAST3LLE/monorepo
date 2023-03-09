import React, { ReactNode } from 'react'

import { ForgeWeb3ProviderProps } from './types'
import { useForgeW3EthereumClient, useForgeWagmiClient } from './utils'
import { ForgeW3WagmiProvider } from './wagmi'
import { ForgeW3Web3Modal } from './web3Modal'

export * from './wagmi'
export * from './web3Modal'
export * from './utils'
export * from './types'

export const ForgeW3Providers = ({
  children,
  walletconnectConfig
}: {
  children: ReactNode
  standalone?: boolean
  walletconnectConfig: ForgeWeb3ProviderProps
}) => {
  const wagmiClient = useForgeWagmiClient(walletconnectConfig)
  const ethereumClient = useForgeW3EthereumClient(
    walletconnectConfig.ethereumClient,
    wagmiClient,
    walletconnectConfig.walletConnect.chains
  )

  return (
    <>
      <ForgeW3Web3Modal ethereumClient={ethereumClient} {...walletconnectConfig} />
      <ForgeW3WagmiProvider wagmiClient={wagmiClient}>{children}</ForgeW3WagmiProvider>
    </>
  )
}
