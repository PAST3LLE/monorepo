// import { EthereumClient, w3mProvider } from '@web3modal/ethereum'
import { useMemo } from 'react'
import { Chain, Transport, http } from 'viem'
import { Config as ClientConfig, CreateConnectorFn, WagmiProviderProps, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { ConnectorEnhanced } from '../../types'
import { PstlWeb3ModalProps, ReadonlyChains, WalletConnectConfig } from '../types'

interface ClientConfigEnhanced extends Omit<ClientConfig, 'connectors'> {
  connectors?: (() => ConnectorEnhanced[]) | ConnectorEnhanced[]
}
interface CreateWagmiClientProps<chains extends readonly [Chain, ...Chain[]]> {
  appName: string
  chains: chains
  connectors: CreateConnectorFn[]
  w3mConnectorProps: WalletConnectConfig
  options?: Partial<Pick<ClientConfigEnhanced, 'getClient'>> & {
    transports?: Record<chains[number]['id'], Transport>
    pollingInterval?: number
    connectors?: CreateConnectorFn[]
  }
}

declare module 'wagmi' {
  interface Register {
    config: WagmiClient
  }
}

export type WagmiClient = ReturnType<typeof createConfig>
function createWagmiClient<chains extends readonly [Chain, ...Chain[]]>({
  options,
  ...props
}: CreateWagmiClientProps<chains>): WagmiProviderProps['config'] {
  const transportsMap = props.chains.reduce(
    (acc, chain) => ({
      ...acc,
      [chain.id]: http()
    }),
    {} as Record<chains[number]['id'], Transport>
  )

  const connectors = [
    walletConnect({
      ...props.w3mConnectorProps,
      projectId: props.w3mConnectorProps.projectId,
      showQrModal: true,
      qrModalOptions: props.w3mConnectorProps
    }),
    ...props.connectors
  ]

  return createConfig({
    chains: props.chains,
    connectors,
    transports: { ...transportsMap, ...options?.transports }
  })
}

// function createEthereumClient<chains extends ReadonlyChains = ReadonlyChains>(
//   wagmiClient: ReturnType<typeof createWagmiClient>,
//   chains: chains
// ) {
//   return new EthereumClient(wagmiClient, chains as any)
// }

export type PstlWagmiClientOptions<chains extends readonly [Chain, ...Chain[]]> = {
  client?: WagmiClient
  options?: Partial<CreateWagmiClientProps<chains>['options']>
}

export function usePstlWagmiClient<chains extends ReadonlyChains>(
  props: Omit<PstlWeb3ModalProps<chains>, 'connectors'> & {
    connectors: CreateWagmiClientProps<chains>['connectors']
  }
): ReturnType<typeof createWagmiClient> {
  return useMemo(
    () =>
      !props.clients?.wagmi?.client
        ? createWagmiClient({
            appName: props.appName,
            chains: props.chains,
            connectors: props.connectors,
            w3mConnectorProps: props.modals.walletConnect,
            options: { ...props?.clients?.wagmi?.options, ...props.options }
          })
        : props.clients.wagmi.client,
    [props]
  )
}

// export function usePstlEthereumClient<chains extends ReadonlyChains>(
//   ethereumClient: EthereumClient | undefined,
//   wagmiClient: ReturnType<typeof createWagmiClient>,
//   chains: chains
// ) {
//   const client = useMemo(
//     () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
//     [chains, ethereumClient, wagmiClient]
//   )

//   return client
// }

/**
 * @name addConnector
 * @description Adds a new Wagmi connector to the modal. Takes 2 parameters:
 * @param ConnectorFn - CreateConnectorFn
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
export const addConnector =
  <C extends CreateConnectorFn>(ConnectorFn: C, options: Omit<Parameters<C>[0], 'chains'>) =>
  (chains: readonly [Chain, ...Chain[]]) =>
    ConnectorFn({ chains, ...options })
