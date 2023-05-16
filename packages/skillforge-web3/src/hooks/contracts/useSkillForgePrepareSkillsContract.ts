import { Skills__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { SkillForgeContractAddressMap, SupportedChains } from '../../types'
import { CommonHooksProps } from '../types'
import { useSkillForgeGetSkillAddress } from './useSkillForgeGetSkillAddress'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const skillsAbi = Skills__factory.abi
export function useSkillForgePrepareSkillsContract<M extends SkillForgeContractAddressMap>(props: CommonHooksProps<M>) {
  const { data: address } = useSkillForgeGetSkillAddress({
    collectionId: props.collectionId,
    contractAddressMap: props.addressMap
  })

  return useSkillForgePrepareContract(skillsAbi, address) as PrepareWriteContractResult<
    typeof Skills__factory.abi,
    string,
    SupportedChains
  >
}
