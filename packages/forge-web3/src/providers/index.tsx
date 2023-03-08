import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal as Web3ModalComponent } from '@web3modal/react'
import React, { ReactNode, useMemo } from 'react'
import { WagmiConfig } from 'wagmi'

import { WalletConnectProps as ForgeWeb3ProviderProps, createWagmiClient } from './web3Modal'

export const WagmiProvider = ({
  children,
  wagmiClient
}: {
  children: ReactNode
  wagmiClient: ReturnType<typeof createWagmiClient>
}) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>

export const Web3Modal = ({
  wagmiClient,
  walletConnect: { chains, themeBackground = 'themeColor', projectId, ...restWalletconnectProps }
}: ForgeWeb3ProviderProps & { wagmiClient: ReturnType<typeof createWagmiClient> }) => {
  if (!projectId) {
    throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
  }

  const ethereumClient = useMemo(() => new EthereumClient(wagmiClient, chains), [])

  return (
    <Web3ModalComponent
      themeBackground={themeBackground}
      projectId={projectId}
      ethereumClient={ethereumClient}
      {...restWalletconnectProps}
    />
  )
}

export const Web3Providers = ({
  children,
  walletconnectConfig
}: {
  children: ReactNode
  walletconnectConfig: ForgeWeb3ProviderProps
}) => {
  const wagmiClient = useMemo(() => createWagmiClient(walletconnectConfig), [walletconnectConfig])
  return (
    <>
      <Web3Modal {...walletconnectConfig} wagmiClient={wagmiClient} />
      <WagmiProvider wagmiClient={wagmiClient}>{children}</WagmiProvider>
    </>
  )
}

export { type ForgeWeb3ProviderProps }
