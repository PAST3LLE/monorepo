import { SupportedChains } from '../types/chains'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP = {
  [SupportedChains.GOERLI]: {
    collections: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3',
    skills: [
      { id: 1, address: '0x95649e31e9A88f3dCAD3F39022d220174b170B09' },
      { id: 2, address: '0x95649e31e9A88f3dCAD3F39022d220174b170B09' },
      { id: 3, address: '0xc0E631d9D5F13d0cb7Df828999cD916A87ab9A71' }
    ]
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collections: '0xffF5E44B23bF0dF66Cdf6FF4f4d000a6b418F1f7',
    // TODO: fix, these are goerli addresses
    skills: [
      { id: 1, address: '0x95649e31e9A88f3dCAD3F39022d220174b170B09' },
      { id: 2, address: '0x95649e31e9A88f3dCAD3F39022d220174b170B09' },
      { id: 3, address: '0xc0E631d9D5F13d0cb7Df828999cD916A87ab9A71' }
    ]
  }
} as const

export const METADATA_URIS_MAP = {
  [SupportedChains.GOERLI]: {
    collections: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json',
    skills: [
      { id: 1, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/{id}.json' },
      { id: 2, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/{id}.json' },
      { id: 3, uri: 'ipfs://QmPVRrcb9jg2dewYC5fBTGYVbBG9ixLnYuz8z2BXammNm1/{id}.json' }
    ]
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collections: 'https://pstlcollections.s3.eu-south-2.amazonaws.com/collections/{id}.json',
    skills: [
      { id: 1, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/{id}.json' },
      { id: 2, uri: 'ipfs://Qmdjdy57ptHQd3fWQnmAz8e4YMkdSBsGav6bT6LLe8nttH/{id}.json' },
      { id: 3, uri: 'ipfs://QmPVRrcb9jg2dewYC5fBTGYVbBG9ixLnYuz8z2BXammNm1/{id}.json' }
    ]
  }
} as const

export const SKILLS_MUMBAI = CONTRACT_ADDRESSES_MAP[SupportedChains.POLYGON_MUMBAI].skills
export const SKILLS_GOERLI = CONTRACT_ADDRESSES_MAP[SupportedChains.GOERLI].skills

export type SkillsCollectionIdGoerli = keyof typeof SKILLS_GOERLI
export type SkillsCollectionIdMumbai = keyof typeof SKILLS_MUMBAI

export const SKILLS_URI_MUMBAI = METADATA_URIS_MAP[SupportedChains.POLYGON_MUMBAI].skills
export const SKILLS_URI_GOERLI = METADATA_URIS_MAP[SupportedChains.GOERLI].skills
