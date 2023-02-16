import { SupportedChains } from '../types/chains'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { useNetwork } from 'wagmi'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function usePrepareSkillsContract(collectionId: number) {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  // const collections = usePrepareCollectionsContract()

  return { chainId, pstlBaseSkillsAbi, collectionId }
}
