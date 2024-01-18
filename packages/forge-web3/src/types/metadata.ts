import { FORGE_SUPPORTED_CHAINS } from '../constants/chains'

export type ForgeMetadataUriMap = Partial<{
  [id in (typeof FORGE_SUPPORTED_CHAINS)[number]['id']]: {
    collectionsManager: string
  }
}>
