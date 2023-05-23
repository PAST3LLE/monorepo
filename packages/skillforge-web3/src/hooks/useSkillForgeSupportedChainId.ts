import { useNetwork } from 'wagmi'

import { SupportedChains } from '../types/chains'

export function useSupportedChainId() {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.GOERLI

  return chainId
}
