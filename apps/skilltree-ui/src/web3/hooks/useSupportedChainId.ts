import { useNetwork } from 'wagmi'
import { SupportedChains } from 'web3/types/chains'

export function useSupportedChainId() {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  return chainId
}
