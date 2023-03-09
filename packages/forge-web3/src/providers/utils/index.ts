import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain, configureChains, createClient } from 'wagmi'

import { WalletConnectProps } from '../types'

const createForgeW3WagmiClient = (props: { appName: string; chains: Chain[]; projectId: string }) =>
  createClient({
    autoConnect: true,
    connectors: [
      ...w3mConnectors({
        projectId: props.projectId,
        version: 2,
        chains: props.chains
      }),
      new SafeConnector(props)
    ],
    provider: configureChains(props.chains, [w3mProvider({ projectId: props.projectId })]).provider
  })
const createForgeW3EthereumClient = (wagmiClient: ForgeW3WagmiClient, chains: Chain[]) =>
  new EthereumClient(wagmiClient, chains)

export type ForgeW3WagmiClient = ReturnType<typeof createForgeW3WagmiClient>

export function useForgeWagmiClient(props: WalletConnectProps) {
  return useMemo(
    () =>
      !props.wagmiClient
        ? createForgeW3WagmiClient({
            appName: props.appName,
            chains: props.walletConnect.chains,
            projectId: props.walletConnect.projectId
          })
        : props.wagmiClient,
    [props]
  )
}
export function useForgeW3EthereumClient(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ForgeW3WagmiClient,
  chains: Chain[]
) {
  return useMemo(
    () => (!ethereumClient ? createForgeW3EthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, wagmiClient]
  )
}
