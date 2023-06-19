import { ClientConfig, configureChains } from '@wagmi/core'
import { Chain, EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { providers } from 'ethers'
import { useMemo } from 'react'
import { WagmiConfigProps, createClient } from 'wagmi'

import { PstlWeb3AuthConnector, PstlWeb3AuthConnectorProps } from '../../connectors/web3auth'
import { ConnectorEnhanced } from '../../types'
import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced<any, any, any>[]) | ConnectorEnhanced<any, any, any>[]
}
interface CreateWagmiClientProps<ID extends number, SC extends ChainsPartialReadonly<ID> = ChainsPartialReadonly<ID>> {
  appName: string
  chains: ChainsPartialReadonly<ID>
  w3mConnectorProps: PstlWeb3ModalProps<ID, SC>['modals']['w3m']
  w3aConnectorProps: Omit<PstlWeb3AuthConnectorProps<ID>, 'chains'>
  options?: Partial<Pick<ClientConfigEnhanced, 'connectors' | 'provider' | 'autoConnect'>> & {
    providers?: providers.BaseProvider[]
    pollingInterval?: number
  }
}
export type WagmiClient = ReturnType<typeof createClient>
function createWagmiClient<ID extends number>({
  options,
  ...props
}: CreateWagmiClientProps<ID>): WagmiConfigProps['client'] {
  const connectors = Array.isArray(options?.connectors) ? options?.connectors : options?.connectors?.()
  const providers = options?.providers || []

  return createClient({
    autoConnect: !!options?.autoConnect,
    connectors: [
      // Web3Auth aka social login
      PstlWeb3AuthConnector({ chains: props.chains, ...props.w3aConnectorProps }),
      // Web3Modal
      ...w3mConnectors({
        projectId: props.w3mConnectorProps.projectId,
        version: 2,
        chains: props.chains as Chain[]
      }),
      // any use custom modals
      ...(connectors || [])
    ],
    provider:
      options?.provider ||
      configureChains(
        props.chains as Chain[],
        [w3mProvider({ projectId: props.w3mConnectorProps.projectId }), ...providers],
        { pollingInterval: options?.pollingInterval || 4000 }
      ).provider
  })
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
) {
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
