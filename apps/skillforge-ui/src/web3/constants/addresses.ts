import COLLECTIONS_MANAGER_ADDRESSES from '../../forge-networks.json'
import CONTRACTS_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import { Address } from '@past3lle/types'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP = {
  [5]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[5].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[5].MergeManager.address as Address
  },
  [137]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[137].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[137].MergeManager.address as Address
  },
  [80001]: {
    collectionsManager: COLLECTIONS_MANAGER_ADDRESSES[80001].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[80001].MergeManager.address as Address
  }
} as const
