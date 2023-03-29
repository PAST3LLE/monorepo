import { devDebug } from '@past3lle/utils'
import React, { useEffect, useState } from 'react'

import { PstlWeb3ModalProps } from '../types'

export const PstlWeb3Modal = ({
  ethereumClient,
  modals: {
    w3m: { projectId, zIndex, themeVariables, ...w3mProps }
  }
}: PstlWeb3ModalProps) => {
  if (!projectId) {
    throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
  }

  const [LazyModal, setModal] = useState<React.ReactElement<any, any>>()

  useEffect(() => {
    if (projectId && ethereumClient?.walletConnectVersion) {
      devDebug('[[PSTL_W3_WEB3_MODAL]]::IMPORTING WEB3MODAL')
      import('@web3modal/react')
        .then(({ Web3Modal }) =>
          setModal(
            <Web3Modal
              {...w3mProps}
              themeVariables={{ '--w3m-z-index': zIndex?.toString(), ...themeVariables }}
              projectId={projectId}
              ethereumClient={ethereumClient}
            />
          )
        )
        .catch(console.error)
    }
  }, [ethereumClient, themeVariables, w3mProps, projectId, zIndex])

  if (!LazyModal) return null

  return LazyModal
}
