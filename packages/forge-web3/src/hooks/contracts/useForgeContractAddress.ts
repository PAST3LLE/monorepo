import { UserConfigState } from '../../state'
import { useSupportedChainId } from '../useForgeSupportedChainId'

export function useForgeContractAddressesByChain<M extends UserConfigState['contractAddressMap']>(addressMap: M) {
  const chainId = useSupportedChainId()
  return chainId ? addressMap[chainId] : undefined
}
