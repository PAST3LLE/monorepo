export type ContractAddressMap = {
  [key: number]: {
    collections: `0x${string}`
    skills: { id: number; address: `0x${string}` }[]
  }
}
