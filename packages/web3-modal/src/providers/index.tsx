import React, { ReactNode } from 'react'

import { PstlWeb3ConnectionModal } from '../components'
import type { PstlW3ProviderProps } from './types'
import { PstlWagmiClientOptions, usePstlEthereumClient, usePstlWagmiClient } from './utils'
import { PstlWagmiProvider } from './wagmi'
import { PstlWeb3Modal } from './web3Modal'

const PstlW3Providers = ({ children, config }: { children: ReactNode; config: PstlW3ProviderProps }) => {
  const wagmiClient = usePstlWagmiClient(config)
  const ethereumClient = usePstlEthereumClient(config.ethereumClient, wagmiClient, config.chains)

  return (
    <>
      <PstlWeb3Modal {...config} ethereumClient={ethereumClient} />
      <PstlWagmiProvider wagmiClient={wagmiClient}>
        <PstlWeb3ConnectionModal {...config.pstlW3Modal} />
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
  type PstlW3ProviderProps,
  type PstlWagmiClientOptions
}
