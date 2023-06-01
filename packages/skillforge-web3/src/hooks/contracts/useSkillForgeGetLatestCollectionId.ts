import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { UserConfigState } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'

export function useSkillForgeGetLatestCollectionId(contractAddressMap: UserConfigState['contractAddressMap']) {
  const addressesByChain = useSkillForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: addressesByChain?.collectionsManager,
    functionName: 'totalSupply',
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })
}
