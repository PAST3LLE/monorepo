import { devDebug } from '@past3lle/utils'
import React, { useEffect, useState } from 'react'

import { SkillForgeW3ProviderProps } from '../types'

export const SkillForgeW3Modal = ({
  ethereumClient,
  walletConnect: { projectId, ...restWalletconnectProps }
}: SkillForgeW3ProviderProps) => {
  if (!projectId) {
    throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
  }

  const [LazyModal, setModal] = useState<React.ReactElement<any, any>>()

  useEffect(() => {
    if (projectId && ethereumClient?.walletConnectVersion) {
      devDebug('[[SKILLFORGE_W3_WEB3_MODAL]]::IMPORTING WEB3MODAL')
      import('@web3modal/react')
        .then(({ Web3Modal }) =>
          setModal(<Web3Modal {...restWalletconnectProps} projectId={projectId} ethereumClient={ethereumClient} />)
        )
        .catch(console.error)
    }
  }, [projectId, ethereumClient?.walletConnectVersion])

  if (!LazyModal) return null

  return LazyModal
}
