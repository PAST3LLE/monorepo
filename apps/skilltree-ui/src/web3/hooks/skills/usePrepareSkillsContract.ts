import { useContractAddressesByChain } from '../useContractAddress'
import { usePrepareContract } from '../usePrepareContract'
import { PSTLAllCollections__factory, PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { BigNumber } from 'ethers'
import { useContractRead } from 'wagmi'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function usePrepareSkillsContract(collectionId: number) {
  const { collections } = useContractAddressesByChain()
  const { data: address } = useContractRead({
    abi: PSTLAllCollections__factory.abi,
    functionName: 'skillsContract',
    args: [BigNumber.from(collectionId)],
    address: collections
  })

  return usePrepareContract(pstlBaseSkillsAbi, address)
}
