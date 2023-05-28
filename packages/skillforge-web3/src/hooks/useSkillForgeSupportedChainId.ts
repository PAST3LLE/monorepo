import { devDebug } from '@past3lle/utils'
import { usePstlConnection } from '@past3lle/web3-modal'
import { useEffect } from 'react'
import { goerli } from 'wagmi/chains'

import { useSkillForgeGetSupportedChainsAtom } from '../state/UserConfig'

export function useSupportedChain() {
  const [supportedChains = []] = useSkillForgeGetSupportedChainsAtom()
  const [, , { chain: rawChain }] = usePstlConnection()

  const currentChainSupported = rawChain && supportedChains.includes(rawChain)
  const chain = currentChainSupported ? rawChain : goerli

  useEffect(() => {
    !currentChainSupported && devDebug('[useSupportedChainId]::Chain ID undefined. Defaulting to GOERLI [5]')
  }, [rawChain])

  return chain
}

export function useSupportedChainId() {
  return useSupportedChain().id
}
