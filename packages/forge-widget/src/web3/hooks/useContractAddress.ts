import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { useSupportedChainId } from './useSupportedChainId'

export function useContractAddressesByChain() {
  const chainId = useSupportedChainId()
  return CONTRACT_ADDRESSES_MAP[chainId]
}
