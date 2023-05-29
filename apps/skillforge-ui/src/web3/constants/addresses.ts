import { SkillForgeContractAddressMap, SupportedChains, CONTRACTS_NETWORKS } from '@past3lle/skillforge-web3'
import { Address } from 'wagmi'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP: SkillForgeContractAddressMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address,
    unlockManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].MergeManager.address as Address
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collectionsManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address,
    unlockManager: CONTRACTS_NETWORKS[SupportedChains.GOERLI].MergeManager.address as Address
  }
}
