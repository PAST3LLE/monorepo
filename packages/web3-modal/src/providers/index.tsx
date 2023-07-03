import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import React, { ReactNode, memo } from 'react'

import { PstlWeb3ConnectionModal } from '../components'
import { useChainIdFromSearchParams } from '../hooks/useChainIdFromSearchParams'
import { ConnectorEnhanced } from '../types'
import type { ChainsPartialReadonly, PstlWeb3ModalProps } from './types'
import { PstlWagmiClientOptions, usePstlEthereumClient, usePstlWagmiClient } from './utils'
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
  const augmentedWagmiConfig = useAugmentWagmiConfig(config.wagmiClient)
  // Logic below applies to non-iframe dapp browsers
  const wagmiClient = usePstlWagmiClient({
    ...config,
    wagmiClient: augmentedWagmiConfig
  })
  const ethereumClient = usePstlEthereumClient(config.ethereumClient, wagmiClient, config.chains)
  const chainIdFromUrl = useChainIdFromSearchParams(config.chains, config.chainFromUrlOptions)

  return (
    <>
      {config.modals?.walletConnect && <PstlWeb3Modal {...config} ethereumClient={ethereumClient} />}
      <PstlWagmiProvider
        wagmiClient={wagmiClient}
        persistOnRefresh={!!config.wagmiClient?.options?.autoConnect}
        chainIdFromUrl={chainIdFromUrl}
      >
        <PstlWeb3ConnectionModal {...config.modals.root} chainIdFromUrl={chainIdFromUrl} />
        {children}
      </PstlWagmiProvider>
    </>
  )
}

function useAugmentWagmiConfig(
  wagmiConfig: PstlWeb3ModalProps<number>['wagmiClient']
): PstlWeb3ModalProps<number>['wagmiClient'] {
  const connectors = wagmiConfig?.options?.connectors
  const connectorsAux = typeof connectors === 'function' ? connectors?.() : connectors || []

  const filteredConnectors = connectorsAux.filter((connector) => {
    return Boolean((connector as ConnectorEnhanced<any, any> & { isIFrame?: boolean })?.isIFrame) == isIframe()
  })

  devDebug(
    '[@past3lle/web3-modal::useFilterFrameConnectors]::filtered connectors:',
    filteredConnectors,
    'Is iFrame?',
    isIframe()
  )

  return {
    ...wagmiConfig,
    options: {
      ...wagmiConfig?.options,
      connectors: filteredConnectors
    }
  }
}

const PstlW3Providers = memo(PstlW3ProvidersBase)

export {
  PstlW3Providers,
  PstlWagmiProvider,
  PstlWeb3Modal,
  // hooks
  usePstlEthereumClient,
  usePstlWagmiClient,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly
}
