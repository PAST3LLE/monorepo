import { Address } from 'abitype'

export type SkillForgeContractAddressMap = {
  [key: number]: {
    collections: Address
    skills: { id: number; address: Address }[]
  }
}
