import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { Chain, ClientConfig, configureChains } from '@wagmi/core'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { WagmiConfigProps, createClient } from 'wagmi'

import PstlWeb3AuthConnector, { PstlWeb3AuthConnectorProps } from '../../connectors/web3auth'
import { ConnectorEnhanced } from '../../types'
import { Web3ModalProps } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced<any, any, any>[]) | ConnectorEnhanced<any, any, any>[]
}

interface CreateWagmiClientProps {
  appName: string
  chains: Chain[]
  w3aId: string
  w3mId: string
  w3aConnectorProps: PstlWeb3AuthConnectorProps
  options?: Partial<Pick<ClientConfigEnhanced, 'connectors' | 'provider' | 'autoConnect'>>
}
export type WagmiClient = ReturnType<typeof createClient>
const createWagmiClient = ({ options, ...props }: CreateWagmiClientProps): WagmiConfigProps['client'] => {
  const connectors = Array.isArray(options?.connectors) ? options?.connectors : options?.connectors?.()
  return createClient({
    autoConnect: true,
    connectors: [
      // Web3Auth aka social login
      PstlWeb3AuthConnector(props.w3aConnectorProps),
      // Web3Modal
      ...w3mConnectors({
        projectId: props.w3mId,
        version: 2,
        chains: props.chains
      }),
      // Safe integration (in-safe-app only)
      new SafeConnector(props),
      // any use custom modals
      ...(connectors || [])
    ],
    provider: options?.provider || configureChains(props.chains, [w3mProvider({ projectId: props.w3mId })]).provider
  })
}
const createEthereumClient = (wagmiClient: ReturnType<typeof createWagmiClient>, chains: Chain[]) =>
  new EthereumClient(wagmiClient, chains)

export type PstlW3WagmiClientOptions = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps['options']>
}
export function usePstlWagmiClient(props: Web3ModalProps) {
  return useMemo(
    () =>
      !props.wagmiClient?.client
        ? createWagmiClient({
            appName: props.appName,
            chains: props.web3Modal.chains,
            w3mId: props.web3Modal.w3mId,
            w3aId: props.web3Modal.w3aId,
            w3aConnectorProps: props.web3Auth,
            options: props.wagmiClient?.options
          })
        : props.wagmiClient.client,
    [props]
  )
}
export function usePstlW3EthereumClient(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: Chain[]
) {
  const client = useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, wagmiClient]
  )

  return client
}
