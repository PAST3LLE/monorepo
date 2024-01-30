import { devWarn } from '@past3lle/utils'
import defaultsDeep from 'lodash.defaultsdeep'
import { useMemo } from 'react'
import { Chain, createClient, http } from 'viem'
import { Connector, WagmiProviderProps, createConfig, fallback } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { Z_INDICES } from '../../constants'
import type { PstlWeb3ModalProps, ReadonlyChains } from '../../providers/types'
import {
  getConfigFromAppType,
  getConnectorsArrayFromConfig,
  getOverridesFromConnectorConfig,
  overrideConnectors,
  setupConnectorFns
} from '../../utils/connectors'

type CreateWagmiClientProps<chains extends readonly [Chain, ...Chain[]]> = Omit<
  PstlWeb3ModalProps<chains>,
  'modals'
> & {
  walletConnect: PstlWeb3ModalProps<chains>['modals']['walletConnect']
}

declare module 'wagmi' {
  interface Register {
    config: WagmiClient
  }
}

export type WagmiClient = ReturnType<typeof createConfig>

export function useCreateWagmiClient<chains extends ReadonlyChains>(
  props: PstlWeb3ModalProps<chains>
): ReturnType<typeof createWagmiClient> {
  return useMemo(() => {
    if (!!(props?.clients?.wagmi?.options && Object.keys(props?.clients.wagmi.options).length)) {
      devWarn(
        '[@past3lle/web3-modal] WARNING! You are passing both "clients.wagmi.options" AND "options" which is unstable and will not be possible in the next major version (3.x). Please copy all properties from "clients.wagmi.options" and move them to the root "options" configuration property.'
      )
    }
    return !props.clients?.wagmi?.client
      ? createWagmiClient({
          appName: props.appName,
          chains: props.chains,
          connectors: props?.connectors || [],
          walletConnect: props.modals.walletConnect,
          // TODO: remove this for just props.options when we deprecate clients.wagmi.options
          options: defaultsDeep(props.options, props?.clients?.wagmi?.options)
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
  const connectors = [
    walletConnect({
      projectId: props.walletConnect.projectId,
      qrModalOptions: {
        ...props.walletConnect,
        themeVariables: {
          ...props.walletConnect.themeVariables,
          '--wcm-z-index':
            props.walletConnect.zIndex?.toString() ||
            props.walletConnect.themeVariables?.['--wcm-z-index'] ||
            Z_INDICES.W3M.toString()
        }
      },
      showQrModal: true
    }),
    ...(getConnectorsArrayFromConfig(props.connectors) || [])
  ]

  const client = createConfig({
    chains: props.chains,
    connectors,
    client({ chain }) {
      const userTransports = options?.transports?.[chain.id as chains[number]['id']]
      const defaultTransports = chain.rpcUrls.default.http.map((url) => http(url))
      return createClient({
        chain,
        transport: fallback(userTransports ? [userTransports, ...defaultTransports] : defaultTransports)
      })
    },
    multiInjectedProviderDiscovery: !!options?.multiInjectedProviderDiscovery
  })

  // check against appType for any derived connectors
  // Get any specific connector/chain config based on the type of app we're running
  // e.g are we in a Safe app? If so, run the Safe connector automatically set with the URL shortName chain
  const derivedConnectors = getConfigFromAppType({ ...props, connectors: client.connectors })

  // check if any are un-setup connectors and set them up
  const setupConnectors: Connector[] = setupConnectorFns(derivedConnectors.connectors, client)
  // Set the new connector state
  client._internal.connectors.setState(setupConnectors)

  // override connectors with user overrides
  overrideConnectors(setupConnectors, getOverridesFromConnectorConfig(props?.connectors), client)

  return client
}
