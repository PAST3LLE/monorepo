import { devDebug } from '@past3lle/utils'
import { IFrameEthereumConnector, isIframe } from '@past3lle/wagmi-connectors'
import React, { ReactNode, memo, useMemo } from 'react'

import { PstlWeb3ConnectionModal } from '../components'
import { useChainIdFromSearchParams } from '../hooks/useChainIdFromSearchParams'
import type { ChainsPartialReadonly, PstlWeb3ModalProps } from './types'
import {
  PstlWagmiClientOptions,
  addConnector,
  addFrameConnector,
  usePstlEthereumClient,
  usePstlWagmiClient
} from './utils'
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

function useDynamicConnectors(
  config: PstlWeb3ModalProps<number>
): PstlWeb3ModalProps<number>['connectors'] | PstlWeb3ModalProps<number>['frameConnectors'] {
  const dynamicConnectors = useMemo(
    () =>
      isIframe()
        ? config.frameConnectors?.length
          ? config.frameConnectors
          : [addConnector(IFrameEthereumConnector, {})]
        : config.connectors,
    [config.connectors, config.frameConnectors]
  )

  if (process.env.IS_COSMOS) {
    devDebug('[@past3lle/web3-modal::useDynamicConnectors] COSMOS detected, returning connectors unaffected')
    return config.connectors
  }

  devDebug(
    '[@past3lle/web3-modal::useDynamicConnectors] Checking connectors compatibility...',
    dynamicConnectors,
    'Is iFrame?',
    isIframe()
  )

  return dynamicConnectors
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
