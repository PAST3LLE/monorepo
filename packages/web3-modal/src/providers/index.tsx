import React, { ReactNode } from 'react'

import { PstlWeb3ConnectionModal } from '../components'
import type { ChainsPartialReadonly, PstlWeb3ModalProps } from './types'
import { PstlWagmiClientOptions, usePstlEthereumClient, usePstlWagmiClient } from './utils'
import { PstlWagmiProvider } from './wagmi'
import { PstlWeb3Modal } from './web3Modal'

const PstlW3Providers = ({ children, config }: { children: ReactNode; config: PstlWeb3ModalProps }) => {
  const wagmiClient = usePstlWagmiClient(config)
  const ethereumClient = usePstlEthereumClient(config.ethereumClient, wagmiClient, config.chains)

  return (
    <>
      <PstlWeb3Modal {...config} ethereumClient={ethereumClient} />
      <PstlWagmiProvider wagmiClient={wagmiClient}>
        <PstlWeb3ConnectionModal {...config.modals.pstl} />
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
