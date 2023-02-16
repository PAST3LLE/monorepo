import { SupportedChains } from 'web3/types/chains'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP

export const CONTRACT_ADDRESSES_MAP = {
  [SupportedChains.GOERLI]: {
    collections: '0x25CeF6E76b7b9C7387414bE6245AEd7846Fe74c3'
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collections: '0xffF5E44B23bF0dF66Cdf6FF4f4d000a6b418F1f7'
  }
} as const
