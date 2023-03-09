import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { ContractAddressMap, SupportedChains } from '../../types'
import { CommonHooksProps } from '../types'
import { useContractAddressesByChain } from './useContractAddress'
import { usePrepareContract } from './usePrepareContract'

const pstlBaseSkillsAbi = PSTLCollectionBaseSkills__factory.abi
export function usePrepareSkillsContract<M extends ContractAddressMap>(props: CommonHooksProps<M>) {
  const { skills } = useContractAddressesByChain(props.addressMap)
  const address = skills[props.collectionId].address

  return usePrepareContract(pstlBaseSkillsAbi, address) as PrepareWriteContractResult<
    typeof PSTLCollectionBaseSkills__factory.abi,
    string,
    SupportedChains
  >
}
