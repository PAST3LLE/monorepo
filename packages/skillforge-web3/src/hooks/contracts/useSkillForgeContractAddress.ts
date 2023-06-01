import { UserConfigState } from '../../state'
import { useSupportedChainId } from '../useSkillForgeSupportedChainId'

export function useSkillForgeContractAddressesByChain<M extends UserConfigState['contractAddressMap']>(addressMap: M) {
  const chainId = useSupportedChainId()
  return chainId ? addressMap?.[chainId] : undefined
}
