import { Address } from 'abitype'

export type SkillForgeContractAddressMap = {
  [chain: number]: {
    collections: Address
    skills: { id: number; address: Address }[]
  }
}
