import { devDebug } from '@past3lle/utils'
import React, { useEffect, useState } from 'react'

import { PstlW3ProviderProps } from '../types'

export const PstlWeb3Modal = ({
  ethereumClient,
  modals: {
    w3m: { w3mId, zIndex, themeVariables, ...w3mProps }
  }
}: PstlW3ProviderProps) => {
  if (!w3mId) {
    throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
  }

  const [LazyModal, setModal] = useState<React.ReactElement<any, any>>()

  useEffect(() => {
    if (w3mId && ethereumClient?.walletConnectVersion) {
      devDebug('[[PSTL_W3_WEB3_MODAL]]::IMPORTING WEB3MODAL')
      import('@web3modal/react')
        .then(({ Web3Modal }) =>
          setModal(
            <Web3Modal
              {...w3mProps}
              themeVariables={{ '--w3m-z-index': zIndex?.toString(), ...themeVariables }}
              projectId={w3mId}
              ethereumClient={ethereumClient}
            />
          )
        )
        .catch(console.error)
    }
  }, [ethereumClient, themeVariables, w3mProps, w3mId, zIndex])

  if (!LazyModal) return null

  return LazyModal
}
