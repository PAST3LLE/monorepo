import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal as Web3ModalComponent } from '@web3modal/react'
import React, { ReactNode, useMemo } from 'react'
import { WagmiConfig } from 'wagmi'

import { SUPPORTED_CHAINS } from '../chains'
import { WalletConnectProps, createWagmiClient } from './web3Modal'

export const WagmiProvider = ({ children, clientProps }: { children: ReactNode; clientProps: WalletConnectProps }) => (
  <WagmiConfig client={createWagmiClient(clientProps)}>{children}</WagmiConfig>
)

export const Web3Modal = (props: WalletConnectProps) => {
  if (!props.walletConnect.projectId) {
    throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
  }

  const ethereumClient = useMemo(() => new EthereumClient(createWagmiClient(props), SUPPORTED_CHAINS), [props])

  return (
    <Web3ModalComponent
      themeBackground="themeColor"
      projectId={props.walletConnect.projectId}
      ethereumClient={ethereumClient}
    />
  )
}

export const Web3Providers = ({
  children,
  walletconnectConfig
}: {
  children: ReactNode
  walletconnectConfig: WalletConnectProps
}) => {
  return (
    <>
      <Web3Modal {...walletconnectConfig} />
      <WagmiProvider clientProps={walletconnectConfig}>{children}</WagmiProvider>
    </>
  )
}
