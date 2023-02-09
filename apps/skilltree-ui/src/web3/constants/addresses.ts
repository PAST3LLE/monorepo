import { SupportedChains } from 'web3/types/chains'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP

export const CONTRACT_ADDRESSES_MAP = {
  [SupportedChains.GOERLI]: {
    collections: '0xAd2f8800E7978C4DB639a0C8D0648164f4818823',
    skills: {
      1: '0xF2EA4990428B30c53C6B1F3E3e265505413b1997',
      2: '0x6A1e668Ba5776EDb926b41B160c489b184A8B162'
    }
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collections: '0xffF5E44B23bF0dF66Cdf6FF4f4d000a6b418F1f7',
    skills: {
      1: '0xECEC89d8FEfAd93a9199b6f9498F75459335e3Cb',
      2: '0xaB4140fA04919BC9653E54646237f5B5036E7d3C',
      3: '0xEe96B42cc61041EF6d73aC17d013728176c0006c'
    }
  }
} as const
