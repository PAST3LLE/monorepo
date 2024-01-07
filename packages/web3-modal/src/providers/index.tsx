import React, { ReactNode, memo } from 'react'

import { PstlWeb3Modal } from '../components'
import { TransactionsUpdater } from '../controllers/TransactionsCtrl/updater'
import { useAutoSwitchToChain } from '../hooks/internal/useAutoSwitchToChain'
import { useConnectorAndChainConfig } from '../hooks/internal/useConnectorAndChainConfig'
import { useUpdateUserConfigState } from '../hooks/state/useUpdateUserConfigState'
import type { Chain, ChainsPartialReadonly, ReadonlyChain } from '../types'
import type { PstlWeb3ModalProps } from './types'
import {
  PstlWagmiClientOptions,
  addConnector,
  addFrameConnector,
  addPublicClients,
  usePstlEthereumClient,
  usePstlWagmiClient
} from './utils'
import { PstlWagmiProvider } from './wagmi'
import { Web3Modal } from './web3Modal'

const PstlW3ProvidersBase = <ID extends number>({
  children,
  config
}: {
  children: ReactNode
  config: PstlWeb3ModalProps<ID>
}) => {
  // Get any specific connector/chain config based on the type of app we're running
  // e.g are we in a Safe app? If so, run the Safe connector automatically set with the URL shortName chain
  const connectorAndChainConfig = useConnectorAndChainConfig(config)
  // Set up the providers
  const wagmiClient = usePstlWagmiClient(connectorAndChainConfig)
  const ethereumClient = usePstlEthereumClient(config.clients?.ethereum, wagmiClient, config.chains)
  // Get the chainId/network info from the URL, if applicable
  const chainFromUrl = useAutoSwitchToChain(config.chains, config)
  // Setup proxy state with user config
  useUpdateUserConfigState(config)

  return (
    <>
      {config.modals?.walletConnect && <Web3Modal {...config} clients={{ ethereum: ethereumClient }} />}
      <PstlWagmiProvider
        wagmiClient={wagmiClient}
        chainFromUrl={chainFromUrl}
        autoConnect={config.options?.autoConnect}
      >
        <PstlWeb3Modal
          {...config.modals.root}
          chainIdFromUrl={chainFromUrl?.id}
          closeModalOnKeys={config.options?.closeModalOnKeys}
        />
        <TransactionsUpdater />
        {children}
      </PstlWagmiProvider>
    </>
  )
}

const PstlW3Providers = memo(PstlW3ProvidersBase)

export {
  PstlW3Providers,
  PstlWagmiProvider,
  Web3Modal as PstlWeb3Modal,
  // hooks
  usePstlEthereumClient,
  usePstlWagmiClient,
  // utils
  addConnector,
  addFrameConnector,
  addPublicClients,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly,
  type ReadonlyChain,
  type Chain
}
