import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'
import {
  Config as ClientConfig,
  Connector,
  WagmiConfigProps,
  configureChains,
  createConfig as createClient
} from 'wagmi'
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
  connectors: PstlWeb3ModalProps<ID, SC>['connectors']
  w3mConnectorProps: PstlWeb3ModalProps<ID, SC>['modals']['walletConnect']
  w3aConnectorProps?: Omit<PstlWeb3AuthConnectorProps<ID>, 'chains'>
  options?: Partial<Pick<ClientConfigEnhanced, 'publicClient'>> & {
    publicClients?: (typeof publicProvider)[]
    pollingInterval?: number
    autoConnect?: boolean
    connectors?: ((chains: Chain[]) => ConnectorEnhanced<any, any>)[]
  }
}
export type WagmiClient = ReturnType<typeof createClient>
function createWagmiClient<ID extends number>({
  options,
  ...props
}: CreateWagmiClientProps<ID>): WagmiConfigProps['config'] {
  const userConnectors = (props?.connectors || options?.connectors || []).map((conn) => conn(props.chains as Chain[]))

  const { publicClient } = configureChains(
    props.chains as Chain[],
    [w3mProvider({ projectId: props.w3mConnectorProps.projectId }), publicProvider()],
    {
      pollingInterval: options?.pollingInterval || 4000
    }
  )

  const walletConnectProviders = w3mConnectors({
    projectId: props.w3mConnectorProps.projectId,
    chains: props.chains as Chain[]
  })

  const connectorsCopy = userConnectors.slice()
  // Check user w3a props - if they exist, init web3auth connector
  if (props?.w3aConnectorProps) {
    connectorsCopy.push(PstlWeb3AuthConnector({ chains: props.chains as Chain[], ...props.w3aConnectorProps }))
  }

  // Check if we have multiple providers via window.ethereum.providersMap (coinbase wallet)
  const userConnectorsContainInjected = userConnectors?.some((conn) => conn.id === 'injected' || conn.id === 'metaMask')
  if (userConnectorsContainInjected) {
    // filter injected providers passed by walletconnect to dedup
    connectorsCopy.push(...walletConnectProviders.filter((connector) => connector.id !== 'injected'))
  }
  // otherwise push the walletConnect providers
  // which includes any injected providers
  else {
    connectorsCopy.push(...walletConnectProviders)
  }

  return createClient({
    autoConnect: !!options?.autoConnect,
    connectors: connectorsCopy,
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
      !props.clients?.wagmi?.client
        ? createWagmiClient({
            appName: props.appName,
            chains: props.chains,
            connectors: props.connectors,
            w3mConnectorProps: props.modals.walletConnect,
            w3aConnectorProps: props.modals.web3auth,
            options: { ...props?.clients?.wagmi?.options, ...props.options }
          })
        : props.clients.wagmi.client,
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

export const addConnector =
  <C extends Class<Connector<any, any>>, T extends Record<string, unknown>>(Connector: C, options: T) =>
  (chains: Chain[]) =>
    new Connector({ chains, options })

export const addFrameConnector =
  <C extends Class<IFrameEthereumConnector>, T extends Record<string, unknown>>(Connector: C, options: T) =>
  (chains: Chain[]) =>
    new Connector({ chains, options })

type Class<T> = new (...args: any[]) => T
