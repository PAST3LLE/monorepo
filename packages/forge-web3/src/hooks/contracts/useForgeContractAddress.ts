import { UserConfigState } from '../../state'
import { useSupportedOrDefaultChainId } from '../useForgeSupportedChainId'

export function useForgeContractAddressesByChain<M extends UserConfigState['contractAddressMap']>(addressMap: M) {
  const chainId = useSupportedOrDefaultChainId()
  return chainId ? addressMap[chainId] : undefined
}
