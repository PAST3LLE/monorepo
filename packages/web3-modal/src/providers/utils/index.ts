import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { Chain, ClientConfig, configureChains } from '@wagmi/core'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { WagmiConfigProps, createClient } from 'wagmi'

import { PstlWeb3AuthConnector, PstlWeb3AuthConnectorProps } from '../../connectors/web3auth'
import { ConnectorEnhanced } from '../../types'
import { PstlW3ProviderProps } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced<any, any, any>[]) | ConnectorEnhanced<any, any, any>[]
}

interface CreateWagmiClientProps {
  appName: string
  chains: Chain[]
  w3mConnectorProps: PstlW3ProviderProps['modals']['w3m']
  w3aConnectorProps: Omit<PstlWeb3AuthConnectorProps, 'chains'>
  options?: Partial<Pick<ClientConfigEnhanced, 'connectors' | 'provider' | 'autoConnect'>>
}
export type WagmiClient = ReturnType<typeof createClient>
const createWagmiClient = ({ options, ...props }: CreateWagmiClientProps): WagmiConfigProps['client'] => {
  const connectors = Array.isArray(options?.connectors) ? options?.connectors : options?.connectors?.()
  return createClient({
    autoConnect: true,
    connectors: [
      // Web3Auth aka social login
      PstlWeb3AuthConnector({ chains: props.chains, ...props.w3aConnectorProps }),
      // Web3Modal
      ...w3mConnectors({
        projectId: props.w3mConnectorProps.w3mId,
        version: 2,
        chains: props.chains
      }),
      // Safe integration (in-safe-app only)
      new SafeConnector(props),
      // any use custom modals
      ...(connectors || [])
    ],
    provider:
      options?.provider ||
      configureChains(props.chains, [w3mProvider({ projectId: props.w3mConnectorProps.w3mId })]).provider
  })
}
const createEthereumClient = (wagmiClient: ReturnType<typeof createWagmiClient>, chains: Chain[]) =>
  new EthereumClient(wagmiClient, chains)

export type PstlWagmiClientOptions = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps['options']>
}
export function usePstlWagmiClient(props: PstlW3ProviderProps) {
  return useMemo(
    () =>
      !props.wagmiClient?.client
        ? createWagmiClient({
            appName: props.appName,
            chains: props.chains,
            w3mConnectorProps: props.modals.w3m,
            w3aConnectorProps: props.modals.w3a,
            options: props.wagmiClient?.options
          })
        : props.wagmiClient.client,
    [props]
  )
}
export function usePstlEthereumClient(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: Chain[]
) {
  const client = useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, ethereumClient, wagmiClient]
  )

  return client
}
