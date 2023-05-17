import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { SkillForgeContractAddressMap } from '../../types'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'

export function useSkillForgeGetLatestCollectionId(contractAddressMap: SkillForgeContractAddressMap) {
  const { collectionsManager } = useSkillForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: collectionsManager,
    functionName: 'totalSupply',
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })
}
