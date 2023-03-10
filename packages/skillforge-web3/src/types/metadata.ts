export type SkillForgeMetadataUriMap = {
  [key: number]: {
    collections: string
    skills: {
      id: number
      uri: `ipfs://${string}`
    }[]
  }
}
