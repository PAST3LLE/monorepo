import { UserConfigState, useForgeContractAddressMapReadAtom } from '../../state'
import { useSupportedOrDefaultChainId } from '../useForgeSupportedChainId'

export function useForgeContractAddressesByChain<M extends UserConfigState['contractAddressMap']>(
  addressMap?: M,
  allowDefault?: boolean
) {
  const chainId = useSupportedOrDefaultChainId(allowDefault)
  const [internalAddressMap] = useForgeContractAddressMapReadAtom()
  const map = addressMap || internalAddressMap
  return chainId ? map[chainId] : undefined
}
