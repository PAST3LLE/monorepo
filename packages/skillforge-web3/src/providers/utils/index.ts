import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { Chain, ClientConfig, configureChains } from '@wagmi/core'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { WagmiConfigProps, createClient } from 'wagmi'

import { Web3ModalProps } from '../types'

interface CreateWagmiClientProps {
  appName: string
  chains: Chain[]
  projectId: string
  options?: Partial<Pick<ClientConfig, 'connectors' | 'provider' | 'autoConnect'>>
}
export type WagmiClient = ReturnType<typeof createClient>
const createWagmiClient = ({ options, ...props }: CreateWagmiClientProps): WagmiConfigProps['client'] => {
  const connectors = Array.isArray(options?.connectors) ? options?.connectors : options?.connectors?.()
  return createClient({
    autoConnect: true,
    connectors: [
      ...(connectors || []),
      ...w3mConnectors({
        projectId: props.projectId,
        version: 2,
        chains: props.chains
      }),
      new SafeConnector(props)
    ],
    provider: options?.provider || configureChains(props.chains, [w3mProvider({ projectId: props.projectId })]).provider
  })
}
const createEthereumClient = (wagmiClient: ReturnType<typeof createWagmiClient>, chains: Chain[]) =>
  new EthereumClient(wagmiClient, chains)

export type SkillForgeW3WagmiClientOptions = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps['options']>
}
export function useSkillForgeWagmiClient(props: Web3ModalProps) {
  return useMemo(
    () =>
      !props.wagmiClient?.client
        ? createWagmiClient({
            appName: props.appName,
            chains: props.web3Modal.chains,
            projectId: props.web3Modal.projectId,
            options: props.wagmiClient?.options
          })
        : props.wagmiClient.client,
    [props]
  )
}
export function useSkillForgeW3EthereumClient(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: Chain[]
) {
  return useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, wagmiClient]
  )
}
