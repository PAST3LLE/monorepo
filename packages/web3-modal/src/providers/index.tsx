// import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { w3mConnectors } from '@web3modal/ethereum'
import React, { ReactNode, memo, useMemo } from 'react'
import { Chain } from 'viem'

import { PstlWeb3ConnectionModal } from '../components'
import { PstlWeb3AuthConnector } from '../connectors/web3auth'
import { useChainIdFromSearchParams } from '../hooks/useChainIdFromSearchParams'
import { ConnectorEnhanced } from '../types/connectors'
import type { ChainsPartialReadonly, PstlWeb3ModalProps } from './types'
import {
  PstlWagmiClientOptions,
  addConnector,
  addFrameConnector,
  usePstlEthereumClient,
  usePstlWagmiClient
} from './utils'
import { AppStatus, getAppStatus, mapChainsToConnectors } from './utils/connectors'
import { PstlWagmiProvider } from './wagmi'
import { PstlWeb3Modal } from './web3Modal'

const PstlW3ProvidersBase = <ID extends number, SC extends ChainsPartialReadonly<ID>>({
  children,
  config
}: {
  children: ReactNode
  config: PstlWeb3ModalProps<ID, SC>
}) => {
  // We run this here in the case we're running this inside a dapp browser iFrame (e.g Ledger dapp browser)
  const dynamicConnectors = useDynamicConnectors(config)
  // Logic below applies to non-iframe dapp browsers
  const wagmiClient = usePstlWagmiClient({
    ...config,
    connectors: dynamicConnectors
  })
  const ethereumClient = usePstlEthereumClient(config.clients?.ethereum, wagmiClient, config.chains)
  const chainIdFromUrl = useChainIdFromSearchParams(config.chains, config?.options?.chainFromUrlOptions)

  return (
    <>
      {config.modals?.walletConnect && <PstlWeb3Modal {...config} clients={{ ethereum: ethereumClient }} />}
      <PstlWagmiProvider
        wagmiClient={wagmiClient}
        persistOnRefresh={!!(config.options?.autoConnect || config.clients?.wagmi?.options?.autoConnect)}
        chainIdFromUrl={chainIdFromUrl}
      >
        <PstlWeb3ConnectionModal {...config.modals.root} chainIdFromUrl={chainIdFromUrl} />
        {children}
      </PstlWagmiProvider>
    </>
  )
}

/* 
  isIframe()
    ? config.frameConnectors?.length
      ? config.frameConnectors
      : [addConnector(IFrameEthereumConnector, {}), addConnector(SafeConnector, { options: { debug: true } })]
    : config.connectors,
*/

function useDynamicConnectors(config: PstlWeb3ModalProps<number>): ConnectorEnhanced<any, any>[] {
  const status = getAppStatus()
  return useMemo((): ConnectorEnhanced<any, any>[] => {
    const defaultConnectors = mapChainsToConnectors(config?.connectors || [], config)

    switch (status) {
      case AppStatus.COSMOS_APP:
        return defaultConnectors
      case AppStatus.SAFE_APP:
      // return mapChainsToConnectors([addConnector(SafeConnector, { options: { debug: true } })], config)
      case AppStatus.IFRAME:
        return mapChainsToConnectors(
          [addConnector(IFrameEthereumConnector, {}), ...(config?.frameConnectors || [])],
          config
        )
      case AppStatus.DAPP:
        const userConnectors = mapChainsToConnectors(config?.connectors || config?.connectors || [], config)
        const walletConnectProviders = w3mConnectors({
          projectId: config.modals.walletConnect.projectId,
          chains: config.chains as Chain[]
        })

        const connectors = userConnectors.slice()
        // Check user w3a props - if they exist, init web3auth connector
        if (config.modals?.web3auth) {
          connectors.push(PstlWeb3AuthConnector({ chains: config.chains as Chain[], ...config.modals.web3auth }))
        }

        // Check if we have multiple providers via window.ethereum.providersMap (coinbase wallet)
        const userConnectorsContainInjected = userConnectors?.some(
          (conn) => conn.id === 'injected' || conn.id === 'metaMask'
        )
        if (userConnectorsContainInjected) {
          // filter injected providers passed by walletconnect to dedup
          connectors.push(...walletConnectProviders.filter((connector) => connector.id !== 'injected'))
        }
        // otherwise push the walletConnect providers
        // which includes any injected providers
        else {
          connectors.push(...walletConnectProviders)
        }
        return defaultConnectors
    }
  }, [config, status])
}

const PstlW3Providers = memo(PstlW3ProvidersBase)

export {
  PstlW3Providers,
  PstlWagmiProvider,
  PstlWeb3Modal,
  // hooks
  usePstlEthereumClient,
  usePstlWagmiClient,
  // utils
  addConnector,
  addFrameConnector,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly
}
