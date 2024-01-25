import React, { ReactNode, memo } from 'react'
import { WagmiProviderProps } from 'wagmi'

import { PstlWeb3Modal } from '../components'
import { TransactionsUpdater } from '../controllers/TransactionsCtrl/updater'
import { useAutoSwitchToChain } from '../hooks/internal/useAutoSwitchToChain'
import { PstlWagmiClientOptions, useCreateWagmiClient } from '../hooks/internal/useCreateWagmiClient'
import { useUpdateUserConfigState } from '../hooks/state/useUpdateUserConfigState'
import type { PstlWeb3ModalProps } from './types'
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
  // Set up the providers
  const wagmiClient = useCreateWagmiClient(config)
  // Get the chainId/network info from the URL, if applicable
  const chainFromUrl = useAutoSwitchToChain(config.chains, config)
  // Setup proxy state with user config
  useUpdateUserConfigState(config)

  return (
    <>
      {/* 
        * Wagmi V2 // Web3Modal V4 is not compatible with this package unfortunately :(
        * Will likely phase out entirely. For now, use walletConnect connector. 
        
        <Web3Modal chains={config.chains as Writable<chains>} config={config.modals.walletConnect} /> 
      */}
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
    </>
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
  type PstlWagmiClientOptions
}
