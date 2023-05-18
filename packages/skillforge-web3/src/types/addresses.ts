import { Address } from 'abitype'

export type SkillForgeContractAddressMap = {
  [chain: number]: {
    collectionsManager: Address
    unlockManager: Address
    mintSkillsManager?: Address
  }
}
