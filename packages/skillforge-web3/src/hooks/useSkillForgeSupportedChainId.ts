import { devDebug } from '@past3lle/utils'
import { usePstlConnection } from '@past3lle/web3-modal'
import { useEffect, useMemo } from 'react'

import { useSkillForgeGetSupportedChainsAtom } from '../state/UserConfig'

export enum SkillForgeW3ChainState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  UNSUPPORTED = 'UNSUPPORTED'
}

export function useChainState() {
  const [supportedChains = []] = useSkillForgeGetSupportedChainsAtom()
  const [, , { chain: rawChain }] = usePstlConnection()

  const chainState = useMemo(() => {
    let chainState: SkillForgeW3ChainState
    if (rawChain === undefined) {
      chainState = SkillForgeW3ChainState.DISCONNECTED
    } else if (!supportedChains.map((chain) => chain.id).includes(rawChain.id)) {
      chainState = SkillForgeW3ChainState.UNSUPPORTED
    } else {
      chainState = SkillForgeW3ChainState.CONNECTED
    }

    return chainState
  }, [rawChain, supportedChains])

  useEffect(() => {
    chainState === SkillForgeW3ChainState.UNSUPPORTED &&
      devDebug('[useSupportedChainId]::Chain ID', rawChain?.id, 'not supported!')
  }, [chainState, rawChain?.id])

  return [rawChain, chainState] as const
}

export function useSupportedChain() {
  const [chain] = useChainState()
  return chain
}

export function useSupportedChainId() {
  return useSupportedChain()?.id
}
