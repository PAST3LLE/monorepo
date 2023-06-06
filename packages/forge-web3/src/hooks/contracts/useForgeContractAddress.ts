import { UserConfigState } from '../../state'
import { SupportedForgeChains } from '../../types'
import { useSupportedChainId } from '../useForgeSupportedChainId'

export function useForgeContractAddressesByChain<M extends UserConfigState<SupportedForgeChains>['contractAddressMap']>(
  addressMap: M
) {
  const chainId = useSupportedChainId()
  return chainId ? addressMap[chainId] : undefined
}
