export type MetadataUriMap = {
  [key: number]: {
    collections: string
    skills: {
      id: number
      uri: `ipfs://${string}`
    }[]
  }
}
