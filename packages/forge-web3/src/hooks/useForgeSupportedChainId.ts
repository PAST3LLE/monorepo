import { devDebug } from '@past3lle/utils'
import { ChainsPartialReadonly, usePstlUserConnectionInfo } from '@past3lle/web3-modal'
import { useEffect, useMemo } from 'react'

import { useForgeGetUserConfigChainsAtom, useForgeReadonlyChainAtom } from '../state/UserConfig'
import { SupportedForgeChains } from '../types'
import { isSupportedChain } from '../utils/chains'

export enum ForgeW3ChainState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  READONLY = 'READONLY',
  UNSUPPORTED = 'UNSUPPORTED'
}

export function useChainState(): [ChainsPartialReadonly<number>[number] | undefined, ForgeW3ChainState] {
  const [supportedChains = []] = useForgeGetUserConfigChainsAtom()
  const { chain: rawChain } = usePstlUserConnectionInfo()
  const [readonlyChain] = useForgeReadonlyChainAtom()

  const chainState: ForgeW3ChainState = useMemo(() => {
    let chainState: ForgeW3ChainState
    if (rawChain === undefined) {
      if (readonlyChain?.id) {
        chainState = ForgeW3ChainState.READONLY
      } else {
        chainState = ForgeW3ChainState.DISCONNECTED
      }
    } else if (!supportedChains.map((chain) => chain.id).includes(rawChain.id as SupportedForgeChains)) {
      chainState = ForgeW3ChainState.UNSUPPORTED
    } else {
      chainState = ForgeW3ChainState.CONNECTED
    }

    return chainState
  }, [rawChain, readonlyChain?.id, supportedChains])

  useEffect(() => {
    chainState === ForgeW3ChainState.UNSUPPORTED &&
      devDebug('[useSupportedChainId]::Chain ID', rawChain?.id, 'not supported!')
  }, [chainState, rawChain?.id])

  return [rawChain, chainState]
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

export function useSupportedOrDefaultChainId() {
  const [defaultChain] = useForgeReadonlyChainAtom()

  return useSupportedChainId() || defaultChain?.id
}
