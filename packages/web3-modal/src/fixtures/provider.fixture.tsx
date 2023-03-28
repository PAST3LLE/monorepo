import { ButtonVariations, ColumnCenter, PstlButton } from '@past3lle/components'
import React, { ReactNode } from 'react'
import { useAccount } from 'wagmi'

import { usePstlWeb3Modal } from '../hooks'
import { PstlW3Providers } from '../providers'
import { commonProps, pstlModalTheme } from './config'

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
  const { open } = usePstlWeb3Modal()

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
const LOGO = 'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/public/512_logo.png'
export default {
  ConnectedModal: (
    <PstlW3Providers
      config={{
        ...commonProps,
        appName: 'COSMOS APP',
        chains: commonProps.chains,
        web3Modal: commonProps.web3Modal,
        web3Auth: {
          appName: 'COSMOS APP',
          listingName: 'SOCIAL',
          w3aId: commonProps.web3Auth.w3aId,
          appLogoLight: LOGO,
          appLogoDark: LOGO,
          modalZIndex: '99999999999'
        },
        pstlW3Modal: {
          theme: pstlModalTheme,
          closeModalOnConnect: false,
          loaderProps: {
            spinnerProps: {
              size: 80
            }
          }
        }
      }}
    >
      <Web3Button />
    </PstlW3Providers>
  )
}
