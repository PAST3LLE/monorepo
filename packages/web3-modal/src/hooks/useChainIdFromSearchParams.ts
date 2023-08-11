import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'
import { Chain } from 'wagmi'

import { PstlWeb3ModalOptions, PstlWeb3ModalProps } from '../providers/types'
import { AppType, getAppType } from '../providers/utils/connectors'

export function useChainIdFromSearchParams(
  chains: PstlWeb3ModalProps<number>['chains'],
  configOptions?: PstlWeb3ModalOptions
) {
  const [derivedChainId, setDerivedChainId] = useState<Chain | undefined>(undefined)

  useEffect(() => {
    _getChainFromUrl(chains, configOptions).then(setDerivedChainId).catch(devError)
  }, [configOptions, chains])

  return derivedChainId
}

async function _getChainFromUrl(
  chains: PstlWeb3ModalProps<number>['chains'],
  configOptions?: PstlWeb3ModalOptions
): Promise<Chain | undefined> {
  const status = getAppType(configOptions?.escapeHatches?.appType)
  let type: 'id' | 'network' | undefined = undefined
  let param: string | number | undefined | null = undefined
  switch (status) {
    case AppType.TEST_FRAMEWORK_IFRAME:
      break
    case AppType.SAFE_APP:
      break
    case AppType.IFRAME:
      break
    case AppType.DAPP: {
      if (typeof globalThis?.window === undefined || !configOptions?.chainFromUrlOptions?.key) return

      const chainParam = new URLSearchParams(location.search).get(configOptions?.chainFromUrlOptions.key)
      type = configOptions?.chainFromUrlOptions?.type
      param = type === 'id' ? Number(chainParam) : chainParam
    }
  }

  return chains.find((userChain) => type && userChain[type] === param)
}
