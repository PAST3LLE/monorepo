import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain, configureChains, createClient } from 'wagmi'

import { WalletConnectProps } from '../types'

const createWagmiClient = (props: { appName: string; chains: Chain[]; projectId: string }) =>
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
const createEthereumClient = (wagmiClient: SkillForgeW3WagmiClient, chains: Chain[]) =>
  new EthereumClient(wagmiClient, chains)

export type SkillForgeW3WagmiClient = ReturnType<typeof createWagmiClient>
export function useSkillForgeWagmiClient(props: WalletConnectProps) {
  return useMemo(
    () =>
      !props.wagmiClient
        ? createWagmiClient({
            appName: props.appName,
            chains: props.walletConnect.chains,
            projectId: props.walletConnect.projectId
          })
        : props.wagmiClient,
    [props]
  )
}
export function useSkillForgeW3EthereumClient(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: SkillForgeW3WagmiClient,
  chains: Chain[]
) {
  return useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, wagmiClient]
  )
}
