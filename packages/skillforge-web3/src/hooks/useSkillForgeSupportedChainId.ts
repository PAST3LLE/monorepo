import { devDebug } from '@past3lle/utils'
import { usePstlConnection } from '@past3lle/web3-modal'
import { goerli } from 'wagmi'

export function useSupportedChain() {
  const [, , { chain: rawChain }] = usePstlConnection()
  const chain = rawChain || goerli

  !chain && devDebug('[useSupportedChainId]::Chain ID undefined. Defaulting to GOERLI [5]')

  return chain
}

export function useSupportedChainId() {
  return useSupportedChain().id
}
