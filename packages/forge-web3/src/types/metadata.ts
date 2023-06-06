import { SupportedForgeChains } from './chains'

export type ForgeMetadataUriMap = Partial<{
  [id in SupportedForgeChains]: {
    collectionsManager: string
  }
}>
