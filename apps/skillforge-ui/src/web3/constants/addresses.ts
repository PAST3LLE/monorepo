import CONTRACTS_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import { Address } from '@past3lle/types'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP = {
  [5]: {
    collectionsManager: CONTRACTS_NETWORKS[5].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[5].MergeManager.address as Address
  },
  [137]: {
    collectionsManager: CONTRACTS_NETWORKS[137].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[137].MergeManager.address as Address
  },
  [80001]: {
    collectionsManager: CONTRACTS_NETWORKS[80001].CollectionsManager.address as Address,
    mergeManager: CONTRACTS_NETWORKS[80001].MergeManager.address as Address
  }
} as const
