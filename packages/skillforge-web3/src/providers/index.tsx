import React, { ReactNode } from 'react'

import type { SkillForgeW3ProviderProps, SkillForgeWeb3ProviderProps } from './types'
import { useSkillForgeW3EthereumClient, useSkillForgeWagmiClient } from './utils'
import { SkillForgeW3WagmiProvider } from './wagmi'
import { SkillForgeW3Modal } from './web3Modal'

const SkillForgeW3Providers = ({
  children,
  walletconnectConfig
}: {
  children: ReactNode
  walletconnectConfig: SkillForgeWeb3ProviderProps
}) => {
  const wagmiClient = useSkillForgeWagmiClient(walletconnectConfig)
  const ethereumClient = useSkillForgeW3EthereumClient(
    walletconnectConfig.ethereumClient,
    wagmiClient,
    walletconnectConfig.walletConnect.chains
  )

  return (
    <>
      <SkillForgeW3Modal ethereumClient={ethereumClient} {...walletconnectConfig} />
      <SkillForgeW3WagmiProvider wagmiClient={wagmiClient}>{children}</SkillForgeW3WagmiProvider>
    </>
  )
}

export {
  SkillForgeW3Providers,
  SkillForgeW3WagmiProvider,
  SkillForgeW3Modal,
  // hooks
  useSkillForgeW3EthereumClient,
  useSkillForgeWagmiClient,
  // types
  type SkillForgeW3ProviderProps,
  type SkillForgeWeb3ProviderProps
}
