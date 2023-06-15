import { devDebug } from '@past3lle/utils'
import { usePstlConnection } from '@past3lle/web3-modal'
import { useEffect, useMemo } from 'react'

import { useForgeGetUserConfigChainsAtom } from '../state/UserConfig'
import { SupportedForgeChains } from '../types'
import { isSupportedChain } from '../utils/chains'

export enum ForgeW3ChainState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  UNSUPPORTED = 'UNSUPPORTED'
}

export function useChainState() {
  const [supportedChains = []] = useForgeGetUserConfigChainsAtom()
  const [, , { chain: rawChain }] = usePstlConnection()

  const chainState = useMemo(() => {
    let chainState: ForgeW3ChainState
    if (rawChain === undefined) {
      chainState = ForgeW3ChainState.DISCONNECTED
    } else if (!supportedChains.map((chain) => chain.id).includes(rawChain.id as SupportedForgeChains)) {
      chainState = ForgeW3ChainState.UNSUPPORTED
    } else {
      chainState = ForgeW3ChainState.CONNECTED
    }

    return chainState
  }, [rawChain, supportedChains])

  useEffect(() => {
    chainState === ForgeW3ChainState.UNSUPPORTED &&
      devDebug('[useSupportedChainId]::Chain ID', rawChain?.id, 'not supported!')
  }, [chainState, rawChain?.id])

  return [rawChain, chainState] as const
}

export function useSupportedChain() {
  const [chain] = useChainState()
  return chain
}

export function useChainId() {
  return useSupportedChain()?.id
}

export function useSupportedChainId(): SupportedForgeChains | undefined {
  const id = useChainId()
  const supportedChain = isSupportedChain(id)
  return supportedChain ? (id as SupportedForgeChains) : undefined
}
