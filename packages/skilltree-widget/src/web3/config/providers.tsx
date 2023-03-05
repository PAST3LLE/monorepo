import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal as Web3ModalComponent } from '@web3modal/react'
import React, { ReactNode, useMemo } from 'react'
import { WagmiConfig, configureChains, createClient } from 'wagmi'

import { AppConfig } from '../../types'
import { SUPPORTED_CHAINS } from './chains'

export interface WalletConnectProps {
  appName: AppConfig['appName']
  walletConnect: {
    projectId: string
  }
}

// Web3Modal Ethereum Client
const createWagmiClient = (props: WalletConnectProps) =>
  createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: props.walletConnect.projectId,
      version: '2',
      appName: props.appName,
      chains: SUPPORTED_CHAINS
    }),
    provider: configureChains(SUPPORTED_CHAINS, [walletConnectProvider({ projectId: props.walletConnect.projectId })])
      .provider
  })

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

export const Web3ModalAndWagmiProvider = ({
  children,
  clientProps
}: {
  children: ReactNode
  clientProps: WalletConnectProps
}) => {
  return (
    <>
      <Web3Modal {...clientProps} />
      <WagmiProvider clientProps={clientProps}>{children}</WagmiProvider>
    </>
  )
}
