import React, { ReactNode, memo } from 'react'
import { WagmiProviderProps } from 'wagmi'

import { PstlWeb3Modal } from '../components'
import { TransactionsUpdater } from '../controllers/TransactionsCtrl/updater'
import { useAutoSwitchToChain } from '../hooks/internal/useAutoSwitchToChain'
import { useConnectorAndChainConfig } from '../hooks/internal/useConnectorAndChainConfig'
import { useUpdateUserConfigState } from '../hooks/state/useUpdateUserConfigState'
import type { Chain, ChainsPartialReadonly, ReadonlyChain } from '../types'
import type { PstlWeb3ModalProps } from './types'
import { PstlWagmiClientOptions, useCreateWagmiClient } from '../hooks/internal/useCreateWagmiClient'
import { PstlWagmiProvider } from './wagmi'

const PstlW3ProvidersBase = <chains extends WagmiProviderProps['config']['chains']>({
  children,
  config,
  autoReconnect = false
}: {
  children: ReactNode
  config: PstlWeb3ModalProps<chains>
  autoReconnect?: boolean
}) => {
  // Get any specific connector/chain config based on the type of app we're running
  // e.g are we in a Safe app? If so, run the Safe connector automatically set with the URL shortName chain
  const connectorAndChainConfig = useConnectorAndChainConfig(config)
  // Set up the providers
  const wagmiClient = useCreateWagmiClient(connectorAndChainConfig)
  // Get the chainId/network info from the URL, if applicable
  const chainFromUrl = useAutoSwitchToChain(config.chains, config)
  // Setup proxy state with user config
  useUpdateUserConfigState(config)

  return (
    <PstlWagmiProvider
      wagmiClient={wagmiClient}
      chainFromUrl={chainFromUrl}
      autoConnect={autoReconnect || config.options?.autoConnect}
    >
      <PstlWeb3Modal
        {...config.modals.root}
        chainIdFromUrl={chainFromUrl?.id}
        closeModalOnKeys={config.options?.closeModalOnKeys}
      />
      <TransactionsUpdater />
      {children}
    </PstlWagmiProvider>
  )
}

const PstlW3Providers = memo(PstlW3ProvidersBase)

export {
  PstlW3Providers,
  PstlWagmiProvider,
  // hooks
  useCreateWagmiClient,
  // types
  type PstlWeb3ModalProps,
  type PstlWagmiClientOptions,
  type ChainsPartialReadonly,
  type ReadonlyChain,
  type Chain
}
