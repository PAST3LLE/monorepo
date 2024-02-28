import { ForgeChainsMinimum } from './appConfig'

export type ForgeMetadataUriMap<forgeChains extends ForgeChainsMinimum> = Partial<{
  [id in forgeChains[number]['id']]: {
    collectionsManager: string
  }
}>
