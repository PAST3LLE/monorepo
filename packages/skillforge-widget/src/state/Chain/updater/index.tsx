import { useForgeGetUserConfigChainsAtom, useForgeSetUrlToReadonlyChain, useW3Connection } from '@past3lle/forge-web3'
import { useEffect, useMemo } from 'react'

import { updateSearchParams } from '../../../utils/url'
import { ForgeSearchParamKeys } from '../../SidePanel/updaters'

export function ChainUpdater() {
  const [, , { chain }] = useW3Connection()
  const [userChains] = useForgeGetUserConfigChainsAtom()

  const { chainParam } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const chainParam = urlParams.get(ForgeSearchParamKeys.FORGE_CHAIN)
    const isParamSet = !!chainParam
    const chainMismatch = !!(chainParam && chainParam !== userChains?.[0]?.network)

    return {
      urlParams,
      chainParam,
      isParamSet,
      chainMismatch
    }
  }, [userChains])

  const [chainFromParam, setReadonlyChain] = useForgeSetUrlToReadonlyChain(chainParam)
  useEffect(() => {
    if (!chain?.network) {
      setReadonlyChain(chainFromParam || userChains[0])
      if (!chainFromParam) updateSearchParams(ForgeSearchParamKeys.FORGE_CHAIN, userChains[0]?.network)
    } else {
      updateSearchParams(ForgeSearchParamKeys.FORGE_CHAIN, chain.network)
    }
  }, [chain?.network, chainFromParam, setReadonlyChain, userChains])

  return null
}
