import React, { ReactNode } from 'react'
import { WagmiConfig, WagmiConfigProps } from 'wagmi'

export const PstlWagmiProvider = ({
  children,
  wagmiClient
}: {
  children: ReactNode
  wagmiClient: WagmiConfigProps['client']
}) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
