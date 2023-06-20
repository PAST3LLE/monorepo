import React, { ReactNode } from 'react'

import { PstlWeb3ConnectionModal } from '../components'
import { useChainIdFromSearchParams } from '../hooks/useChainIdFromSearchParams'
import type { ChainsPartialReadonly, PstlWeb3ModalProps } from './types'
import { PstlWagmiClientOptions, usePstlEthereumClient, usePstlWagmiClient } from './utils'
import { PstlWagmiProvider } from './wagmi'
import { PstlWeb3Modal } from './web3Modal'

const PstlW3Providers = <ID extends number, SC extends ChainsPartialReadonly<ID>>({
  children,
  config
}: {
  children: ReactNode
  config: PstlWeb3ModalProps<ID, SC>
}) => {
  const wagmiClient = usePstlWagmiClient(config)
  const ethereumClient = usePstlEthereumClient(config.ethereumClient, wagmiClient, config.chains)

  const chainIdFromUrl = useChainIdFromSearchParams(config.chains, config.chainFromUrlOptions)

  return (
    <>
      <PstlWeb3Modal {...config} ethereumClient={ethereumClient} />
      <PstlWagmiProvider
        wagmiClient={wagmiClient}
        persistOnRefresh={config.wagmiClient?.options?.autoConnect}
        chainIdFromUrl={chainIdFromUrl}
      >
        <PstlWeb3ConnectionModal {...config.modals.pstl} chainIdFromUrl={chainIdFromUrl} />
        {children}
      </PstlWagmiProvider>
    </>
  )
}

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
