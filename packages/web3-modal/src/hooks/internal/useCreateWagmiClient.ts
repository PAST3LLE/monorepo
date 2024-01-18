import { useMemo } from 'react'
import { Chain, Transport, http } from 'viem'
import { WagmiProviderProps, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import type { PstlWeb3ModalProps, ReadonlyChains } from '../../providers/types'
import { getConnectorsArrayFromConfig } from '../../utils/connectors'
import { connectorOverridePropSelector } from '../../utils/misc'

type CreateWagmiClientProps<chains extends readonly [Chain, ...Chain[]]> = Pick<
  Required<PstlWeb3ModalProps<chains>>,
  'options' | 'chains' | 'connectors' | 'appName'
> & {
  walletConnect: PstlWeb3ModalProps<chains>['modals']['walletConnect']
}

declare module 'wagmi' {
  interface Register {
    config: WagmiClient
  }
}

export type WagmiClient = ReturnType<typeof createConfig>
export type PstlWagmiClientOptions<chains extends readonly [Chain, ...Chain[]]> = {
  client?: WagmiClient
  options: Partial<CreateWagmiClientProps<chains>['options']>
}

export function useCreateWagmiClient<chains extends ReadonlyChains>(
  props: PstlWeb3ModalProps<chains>
): ReturnType<typeof createWagmiClient> {
  return useMemo(() => {
    return !props.clients?.wagmi?.client
      ? createWagmiClient({
          appName: props.appName,
          chains: props.chains,
          connectors: props?.connectors || [],
          walletConnect: props.modals.walletConnect,
          options: { ...props?.clients?.wagmi?.options, ...props.options }
        })
      : props.clients.wagmi.client
  }, [props.clients?.wagmi, props.appName, props.chains, props.connectors, props.modals.walletConnect, props.options])
}

/* 
* Disabled until @web3modal updates to wagmi V2
* For now we just use walletConnect connect which is slower :(
import { EthereumClient, w3mProvider } from '@web3modal/ethereum'

export function usePstlEthereumClient<chains extends ReadonlyChains>(
  ethereumClient: EthereumClient | undefined,
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: chains
) {
  const client = useMemo(
    () => (!ethereumClient ? createEthereumClient(wagmiClient, chains) : ethereumClient),
    [chains, ethereumClient, wagmiClient]
  )

  return client
}

function createEthereumClient<chains extends ReadonlyChains = ReadonlyChains>(
  wagmiClient: ReturnType<typeof createWagmiClient>,
  chains: chains
) {
  return new EthereumClient(wagmiClient, chains as any)
} 
*/

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
      projectId: props.walletConnect.projectId,
      qrModalOptions: props.walletConnect,
      showQrModal: true
    }),
    ...(getConnectorsArrayFromConfig(props.connectors) || [])
  ]

  const client = createConfig({
    chains: props.chains,
    connectors,
    transports: { ...transportsMap, ...options?.transports },
    multiInjectedProviderDiscovery: !!options?.multiInjectedProviderDiscovery
  })

  if ('overrides' in props.connectors) {
    const overrides = props.connectors?.overrides || {}
    client._internal.connectors.setState(connectors => connectors.map(sConn => ({
      ...sConn,
      ...connectorOverridePropSelector(overrides, [sConn.id, sConn.name, sConn.type]),
    })))
  }

  return client
}