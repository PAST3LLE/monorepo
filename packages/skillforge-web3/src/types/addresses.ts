import { Address } from 'abitype'

export type SkillForgeContractAddressMap = {
  [chain: number]: {
    collectionsManager: Address
    mergeManager: Address
  }
}
