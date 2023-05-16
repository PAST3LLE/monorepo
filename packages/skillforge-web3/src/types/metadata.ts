export type SkillForgeMetadataUriMap = {
  [key: number]: {
    collectionsManager: string
    skills?: {
      id: number
      uri: `ipfs://${string}`
    }[]
  }
}
