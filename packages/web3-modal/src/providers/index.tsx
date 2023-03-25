import React, { ReactNode } from 'react'

import type { PstlW3ProviderProps } from './types'
import { PstlW3WagmiClientOptions, usePstlW3EthereumClient, usePstlWagmiClient } from './utils'
import { PstlW3WagmiProvider } from './wagmi'
import { PstlW3Modal } from './web3Modal'

const PstlW3Providers = ({ children, config }: { children: ReactNode; config: PstlW3ProviderProps }) => {
  const wagmiClient = usePstlWagmiClient(config)
  const ethereumClient = usePstlW3EthereumClient(config.ethereumClient, wagmiClient, config.web3Modal.chains)

  return (
    <>
      <PstlW3Modal {...config} ethereumClient={ethereumClient} />
      <PstlW3WagmiProvider wagmiClient={wagmiClient}>{children}</PstlW3WagmiProvider>
    </>
  )
}

export {
  PstlW3Providers,
  PstlW3WagmiProvider,
  PstlW3Modal,
  // hooks
  usePstlW3EthereumClient,
  usePstlWagmiClient,
  // types
  type PstlW3ProviderProps,
  type PstlW3WagmiClientOptions
}
