import {
  useForgeGetUserConfigChainsAtom,
  useForgeSetUrlToReadonlyChain,
  useW3UserConnectionInfo
} from '@past3lle/forge-web3'
import { devDebug } from '@past3lle/utils'
import { isIframe } from '@past3lle/wagmi-connectors'
import { useEffect, useState } from 'react'

import { updateSearchParams } from '../../../utils/url'
import { ForgeSearchParamKeys } from '../../SidePanel/updaters'

export function DappChainUpdater() {
  const { chain } = useW3UserConnectionInfo()
  const [userChains] = useForgeGetUserConfigChainsAtom()
  const [chainParam, setChainParam] = useState<string | null>(null)

  useEffect(() => {
    if (isIframe()) return

    devDebug(
      '[@past3lle/skillforge-widget] Chain - DappChainUpdater - Dapp detected, setting user chains based on URL / settings.'
    )

    const urlParams = new URLSearchParams(window.location.search)
    const chainParam = urlParams.get(ForgeSearchParamKeys.FORGE_CHAIN)

    setChainParam(chainParam)
  }, [])

  const [chainFromParam, setReadonlyChain] = useForgeSetUrlToReadonlyChain(chainParam)
  useEffect(() => {
    if (isIframe()) return

    if (!chain?.network) {
      setReadonlyChain(chainFromParam || userChains[0])
      if (!chainFromParam) updateSearchParams(ForgeSearchParamKeys.FORGE_CHAIN, userChains[0]?.network)
    } else {
      updateSearchParams(ForgeSearchParamKeys.FORGE_CHAIN, chain.network)
    }
  }, [chain?.network, chainFromParam, setReadonlyChain, userChains])

  return null
}
