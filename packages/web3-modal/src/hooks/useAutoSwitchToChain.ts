import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'

import { Chain, PstlWeb3ModalProps } from '../providers/types'
import { getAppType } from '../providers/utils/connectors'

export function useAutoSwitchToChain(chains: PstlWeb3ModalProps['chains'], config?: PstlWeb3ModalProps) {
  const [derivedChainId, setDerivedChainId] = useState<Chain<number> | undefined>(undefined)

  useEffect(() => {
    _getChainFromUrl(chains, config).then(setDerivedChainId).catch(devError)
  }, [config, chains])

  return derivedChainId
}

async function _getChainFromUrl(
  chains: PstlWeb3ModalProps['chains'],
  config?: PstlWeb3ModalProps
): Promise<Chain<number> | undefined> {
  const status = getAppType(config?.options?.escapeHatches?.appType)

  switch (status) {
    case 'TEST_FRAMEWORK_IFRAME':
    case 'SAFE_APP':
    case 'IFRAME':
      return undefined
    case 'DAPP': {
      return config?.callbacks?.switchChain?.(chains)
    }
  }
}
