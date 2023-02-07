import { useSupportedChainId } from './useSupportedChainId'
import { CONTRACT_ADDRESSES_MAP } from 'web3/constants/addresses'

export function useContractAddressesByChain() {
  const chainId = useSupportedChainId()
  return CONTRACT_ADDRESSES_MAP[chainId]
}
