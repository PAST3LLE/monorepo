import { SupportedChains } from 'web3/types/chains'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP

export const CONTRACT_ADDRESSES_MAP = {
  [SupportedChains.GOERLI]: {
    collections: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3',
    skills: {
      2: '0x95649e31e9A88f3dCAD3F39022d220174b170B09',
      3: '0xc0E631d9D5F13d0cb7Df828999cD916A87ab9A71'
    }
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collections: '0xffF5E44B23bF0dF66Cdf6FF4f4d000a6b418F1f7',
    // TODO: fix, these are goerli addresses
    skills: {
      2: '0x95649e31e9A88f3dCAD3F39022d220174b170B09',
      3: '0xc0E631d9D5F13d0cb7Df828999cD916A87ab9A71'
    }
  }
} as const

export const SKILLS_MUMBAI = CONTRACT_ADDRESSES_MAP[SupportedChains.POLYGON_MUMBAI].skills
export const SKILLS_GOERLI = CONTRACT_ADDRESSES_MAP[SupportedChains.GOERLI].skills

export type SkillsCollectionIdGoerli = keyof typeof SKILLS_GOERLI
export type SkillsCollectionIdMumbai = keyof typeof SKILLS_MUMBAI
