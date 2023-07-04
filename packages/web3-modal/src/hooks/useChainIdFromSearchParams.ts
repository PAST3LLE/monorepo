import { useEffect, useState } from 'react'

import { PstlWeb3ModalOptions, PstlWeb3ModalProps } from '../providers/types'

export function useChainIdFromSearchParams(
  chains: PstlWeb3ModalProps<number>['chains'],
  chainFromUrlOptions: PstlWeb3ModalOptions['chainFromUrlOptions']
) {
  const [derivedChainId, setDerivedChainId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!chainFromUrlOptions?.key) return

    const chainParam = new URLSearchParams(location.search).get(chainFromUrlOptions.key)
    const paramConversion = chainFromUrlOptions.type === 'id' ? Number(chainParam) : chainParam

    const chainId = chains.find((userChain) => userChain[chainFromUrlOptions.type] === paramConversion)?.id
    setDerivedChainId(chainId)
  }, [chainFromUrlOptions?.key, chainFromUrlOptions?.type, chains])

  return derivedChainId
}
