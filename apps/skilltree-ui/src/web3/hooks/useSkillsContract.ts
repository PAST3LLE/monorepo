import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { SupportedChains } from '../types/chains'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { Address, useNetwork, usePrepareContractWrite } from 'wagmi'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function usePrepareSkillsContract(collectionId: number) {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  const skillAddresses = CONTRACT_ADDRESSES_MAP[chainId].skills

  if (collectionId in skillAddresses) {
    // @ts-ignore - this will not fail
    const address = skillAddresses[collectionId] as Address
    return usePrepareContractWrite({ abi: pstlBaseSkillsAbi, address })
  } else {
    throw new Error(`Skills collection contract ${collectionId} not found!`)
  }
}
