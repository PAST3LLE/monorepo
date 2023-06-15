import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { UserConfigState } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

export function useForgeGetLatestCollectionId(contractAddressMap: UserConfigState['contractAddressMap']) {
  const addressesByChain = useForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: addressesByChain?.collectionsManager,
    functionName: 'totalSupply',
    scopeKey: WAGMI_SCOPE_KEYS.COLLECTIONS_MANAGER_TOTAL_SUPPLY
  })
}
