import { ContractAddressMap } from '../../types'
import { useSupportedChainId } from '../useSupportedChainId'

export function useContractAddressesByChain<M extends ContractAddressMap>(addressMap: M) {
  const chainId = useSupportedChainId()
  return addressMap[chainId]
}
