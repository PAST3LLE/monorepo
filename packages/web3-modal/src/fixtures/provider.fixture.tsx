import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import React, { ReactNode } from 'react'
import { useAccount } from 'wagmi'

import { useWeb3Modal } from '../hooks'
import { PstlW3Providers } from '../providers'
import { commonProps } from './config'

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/

interface Web3ButtonProps {
  children?: ReactNode
}
const Web3Button = ({ children = <div>Show PSTL Wallet Modal</div> }: Web3ButtonProps) => {
  const { address } = useAccount()
  const { open } = useWeb3Modal()

  return (
    <ColumnCenter>
      <PstlButton
        buttonVariant={ButtonVariations.PRIMARY}
        onClick={() => open({ route: address ? 'Account' : 'ConnectWallet' })}
      >
        {children}
      </PstlButton>
      <h3>Connected to {address || 'DISCONNECTED!'}</h3>
    </ColumnCenter>
  )
}

export default {
  ConnectedModal: (
    <PstlW3Providers
      config={{
        ...commonProps,
        appName: 'TEST COSMOS'
      }}
    >
      <Web3Button />
    </PstlW3Providers>
  )
}
