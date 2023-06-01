import { SkillForgeMetadataUriMap, SupportedChains } from '@past3lle/skillforge-web3'

export const METADATA_URIS_MAP: SkillForgeMetadataUriMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/'
  },
  [SupportedChains.POLYGON_MAINNET]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/'
  }
}
