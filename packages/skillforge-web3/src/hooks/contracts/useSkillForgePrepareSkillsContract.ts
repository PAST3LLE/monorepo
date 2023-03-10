import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { SkillForgeContractAddressMap, SupportedChains } from '../../types'
import { CommonHooksProps } from '../types'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function useSkillForgePrepareSkillsContract<M extends SkillForgeContractAddressMap>(props: CommonHooksProps<M>) {
  const { skills } = useSkillForgeContractAddressesByChain(props.addressMap)
  const address = skills[props.collectionId].address

  return useSkillForgePrepareContract(pstlBaseSkillsAbi, address) as PrepareWriteContractResult<
    typeof PSTLCollectionBaseSkills__factory.abi,
    string,
    SupportedChains
  >
}
