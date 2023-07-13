import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { Chain } from 'wagmi'

import { PstlWeb3ModalOptions, PstlWeb3ModalProps } from '../providers/types'
import { AppType, getAppType } from '../providers/utils/connectors'

export function useChainIdFromSearchParams(
  chains: PstlWeb3ModalProps<number>['chains'],
  chainFromUrlOptions: PstlWeb3ModalOptions['chainFromUrlOptions']
) {
  const [derivedChainId, setDerivedChainId] = useState<Chain | undefined>(undefined)

  useEffect(() => {
    _getChainFromUrl(chains, chainFromUrlOptions).then(setDerivedChainId).catch(devError)
  }, [chainFromUrlOptions, chains])

  return derivedChainId
}

async function _getChainFromUrl(
  chains: PstlWeb3ModalProps<number>['chains'],
  chainFromUrlOptions: PstlWeb3ModalOptions['chainFromUrlOptions']
): Promise<Chain | undefined> {
  const status = getAppType()
  let type: 'id' | 'network' | undefined = undefined
  let param: string | number | undefined | null = undefined
  switch (status) {
    case AppType.COSMOS_APP:
      break
    case AppType.SAFE_APP:
      break
    case AppType.IFRAME:
      break
    case AppType.DAPP: {
      if (typeof globalThis?.window === undefined || !chainFromUrlOptions?.key) return

      const chainParam = new URLSearchParams(location.search).get(chainFromUrlOptions.key)
      type = chainFromUrlOptions?.type
      param = type === 'id' ? Number(chainParam) : chainParam
    }
  }

  return chains.find((userChain) => type && userChain[type] === param)
}
