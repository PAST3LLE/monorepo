import { SkillForgeContractAddressMap, SupportedChains } from '@past3lle/skillforge-web3'

export type ContractAddresses = typeof CONTRACT_ADDRESSES_MAP
export const CONTRACT_ADDRESSES_MAP: SkillForgeContractAddressMap = {
  [SupportedChains.GOERLI]: {
    collectionsManager: '0x9e8e103ed51A18E92c0938573f9b7fB4A393083a',
    unlockManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544',
    mintSkillsManager: undefined
  },
  [SupportedChains.POLYGON_MUMBAI]: {
    collectionsManager: '0x9e8e103ed51A18E92c0938573f9b7fB4A393083a',
    unlockManager: '0x0B397B88C96E22E63D6D9b802df62fe40bB1B544',
    mintSkillsManager: undefined
  }
}
