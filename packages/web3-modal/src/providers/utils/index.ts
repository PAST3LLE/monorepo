import { MakeOptional } from '@past3lle/types'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { EthereumClient, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain } from 'viem'
import { Config as ClientConfig, WagmiConfigProps, configureChains, createConfig as createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

import { PstlWeb3AuthConnectorProps } from '../../connectors/web3auth'
import { ConnectorEnhanced } from '../../types'
import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced<any, any>[]) | ConnectorEnhanced<any, any>[]
}
interface CreateWagmiClientProps<ID extends number> {
  appName: string
  chains: ChainsPartialReadonly<ID>
  connectors: ConnectorEnhanced<any, any>[]
  w3mConnectorProps: PstlWeb3ModalProps<ID>['modals']['walletConnect']
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
  const { publicClient } = configureChains(
    props.chains as Chain[],
    [w3mProvider({ projectId: props.w3mConnectorProps.projectId }), publicProvider()],
    {
      pollingInterval: options?.pollingInterval || 4000
    }
  )

  return createClient({
    autoConnect: !!options?.autoConnect,
    connectors: props?.connectors,
    publicClient: options?.publicClient || publicClient
  }) as WagmiConfigProps['config']
}
function createEthereumClient<ID extends number>(
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: ChainsPartialReadonly<ID>
) {
  return new EthereumClient(wagmiClient, chains as Chain[])
}

export type PstlWagmiClientOptions<ID extends number> = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps<ID>['options']>
}

export function usePstlWagmiClient<ID extends number>(
  props: Omit<PstlWeb3ModalProps<ID>, 'connectors'> & { connectors: CreateWagmiClientProps<ID>['connectors'] }
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

/**
 * @name addConnector
 * @description Adds a new Wagmi connector to the modal. Takes 2 parameters:
 * @param Connector - Uninstantiated connector Class
 * @param params - Class constructor "options" params passed inside an object
 * @returns Instantiated connector with set options and chains (passed from root inside API)
 * 
 * @example
  addConnector(InjectedConnector, {
    // Not necessary or allowed to pass chains here, just options. if connector accepts them
    options: {
      name: 'MetaMask',
      shimDisconnect: true,
      getProvider() {
        try {
          const provider = window?.ethereum?.providers?.find((provider) => provider?.isMetaMask)
          if (!provider) devWarn('Connector', this.name || 'unknown', 'not found!')
          return provider
        } catch (error) {
          return undefined
        }
      }
    }
  })
 */

type InjectedConnectorOptions = MakeOptional<
  Required<Required<Required<ConstructorParameters<typeof InjectedConnector>>[0]>['options']>,
  'shimDisconnect'
>
type GetConnectorConstructorParams<C extends Instance<ConnectorEnhanced<any, any>>> =
  C extends Instance<InjectedConnector>
    ? Omit<Required<Required<ConstructorParameters<C>>[0]>, 'chains'> & {
        options: InjectedConnectorOptions
      }
    : Partial<Omit<ConstructorParameters<C>[0], 'chains'>>

export const addConnector =
  <C extends Instance<ConnectorEnhanced<any, any>>>(Connector: C, params: GetConnectorConstructorParams<C>) =>
  (chains: Chain[]) =>
    new Connector({ chains, options: params?.options })

export const addFrameConnector =
  <C extends Instance<IFrameEthereumConnector>>(Connector: C, params: GetConnectorConstructorParams<C>) =>
  (chains: Chain[]) =>
    new Connector({ chains, options: params?.options })

type Instance<T> = new (...args: any[]) => T
