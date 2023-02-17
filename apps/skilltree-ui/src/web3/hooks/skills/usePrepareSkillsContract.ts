import { useContractAddressesByChain } from '../useContractAddress'
import { usePrepareContract } from '../usePrepareContract'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'
import { SupportedChains } from 'web3/types/chains'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function usePrepareSkillsContract(collectionId: number) {
  const { skills } = useContractAddressesByChain()
  const address = skills[collectionId].address

  return usePrepareContract(pstlBaseSkillsAbi, address) as PrepareWriteContractResult<
    typeof PSTLCollectionBaseSkills__factory.abi,
    string,
    SupportedChains
  >
}
