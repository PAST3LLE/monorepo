import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'
import { Config as ClientConfig, WagmiConfigProps, configureChains, createConfig as createClient } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { PstlWeb3AuthConnector, PstlWeb3AuthConnectorProps } from '../../connectors/web3auth'
import { ConnectorEnhanced } from '../../types'
import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced<any, any>[]) | ConnectorEnhanced<any, any>[]
}
interface CreateWagmiClientProps<ID extends number, SC extends ChainsPartialReadonly<ID> = ChainsPartialReadonly<ID>> {
  appName: string
  chains: ChainsPartialReadonly<ID>
  w3mConnectorProps: PstlWeb3ModalProps<ID, SC>['modals']['w3m']
  w3aConnectorProps: Omit<PstlWeb3AuthConnectorProps<ID>, 'chains'>
  options?: Partial<Pick<ClientConfigEnhanced, 'connectors' | 'publicClient'>> & {
    publicClients?: (typeof publicProvider)[]
    pollingInterval?: number
    autoConnect?: boolean
  }
}
export type WagmiClient = ReturnType<typeof createClient>
function createWagmiClient<ID extends number>({
  options,
  ...props
}: CreateWagmiClientProps<ID>): WagmiConfigProps['config'] {
  const userConnectors = (
    Array.isArray(options?.connectors) ? options?.connectors : options?.connectors?.() || []
  ) as ConnectorEnhanced<any, any>[]
  const { publicClient } = configureChains(
    props.chains as Chain[],
    [w3mProvider({ projectId: props.w3mConnectorProps.projectId }), publicProvider()],
    {
      pollingInterval: options?.pollingInterval || 4000
    }
  )

  return createClient({
    autoConnect: !!options?.autoConnect,
    connectors: [
      PstlWeb3AuthConnector({ chains: props.chains as Chain[], ...props.w3aConnectorProps }),
      w3mConnectors({ projectId: props.w3mConnectorProps.projectId, chains: props.chains as Chain[] })[0],
      // any use custom modals
      ...userConnectors
    ],
    publicClient: options?.publicClient || publicClient
  }) as WagmiConfigProps['config']
}
function createEthereumClient<ID extends number>(
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: ChainsPartialReadonly<ID>
) {
  return new EthereumClient(wagmiClient, chains as Chain[])
}

export type PstlWagmiClientOptions<
  ID extends number,
  SC extends ChainsPartialReadonly<ID> = ChainsPartialReadonly<ID>
> = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps<ID, SC>['options']>
}
export function usePstlWagmiClient<ID extends number, SC extends ChainsPartialReadonly<ID>>(
  props: PstlWeb3ModalProps<ID, SC>
): ReturnType<typeof createWagmiClient> {
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
export function usePstlEthereumClient<ID extends number>(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: ChainsPartialReadonly<ID>
) {
  const client = useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, ethereumClient, wagmiClient]
  )

  return client
}
