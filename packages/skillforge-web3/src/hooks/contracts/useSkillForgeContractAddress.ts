import { SkillForgeContractAddressMap } from '../../types'
import { useSupportedChainId } from '../useSkillForgeSupportedChainId'

export function useSkillForgeContractAddressesByChain<M extends SkillForgeContractAddressMap>(addressMap: M) {
  const chainId = useSupportedChainId()
  return addressMap[chainId]
}
