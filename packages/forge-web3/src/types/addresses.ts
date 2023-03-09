import { Address } from 'abitype'

export type ContractAddressMap = {
  [key: number]: {
    collections: Address
    skills: { id: number; address: Address }[]
  }
}
