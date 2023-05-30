import { SkillForgeMetadataUriMap, SupportedChains } from '@past3lle/skillforge-web3'

export const METADATA_URIS_MAP: SkillForgeMetadataUriMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/'
    // skills: [
    //   { id: 1, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/' },
    //   { id: 2, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/' },
    //   { id: 3, uri: 'ipfs://QmPVRrcb9jg2dewYC5fBTGYVbBG9ixLnYuz8z2BXammNm1/' }
    // ]
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collectionsManager: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/'
    // skills: [
    //   { id: 1, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/' },
    //   { id: 2, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/' },
    //   { id: 3, uri: 'ipfs://QmPVRrcb9jg2dewYC5fBTGYVbBG9ixLnYuz8z2BXammNm1/' }
    // ]
  }
}
