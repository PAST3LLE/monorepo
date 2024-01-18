import { Address } from 'abitype'

import { FORGE_SUPPORTED_CHAINS } from '../constants/chains'

export type ForgeContractAddressMap = Partial<{
  [id in (typeof FORGE_SUPPORTED_CHAINS)[number]['id']]: {
    collectionsManager: Address
    mergeManager: Address
  }
}>
