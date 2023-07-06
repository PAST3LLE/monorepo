import {
  useForgeGetUserConfigChainsAtom,
  useForgeSetUrlToReadonlyChain,
  useW3UserConnectionInfo
} from '@past3lle/forge-web3'
import { useEffect, useState } from 'react'

import { updateSearchParams } from '../../../utils/url'
import { ForgeSearchParamKeys } from '../../SidePanel/updaters'

export function ChainUpdater() {
  const { chain } = useW3UserConnectionInfo()
  const [userChains] = useForgeGetUserConfigChainsAtom()
  const [chainParam, setChainParam] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const chainParam = urlParams.get(ForgeSearchParamKeys.FORGE_CHAIN)

    setChainParam(chainParam)
  }, [])

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
