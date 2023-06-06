import { Address } from 'abitype'

import { SupportedForgeChains } from './chains'

export type ForgeContractAddressMap = Partial<{
  [id in SupportedForgeChains]: {
    collectionsManager: Address
    mergeManager: Address
  }
}>
