import { Collection__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { SupportedChains } from '../../types'
import { WithCollectionId } from '../types'
import { useSkillForgeGetSkillAddress } from './useSkillForgeGetSkillAddress'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const skillsAbi = Collection__factory.abi
export function useSkillForgePrepareSkillsContract({ collectionId }: WithCollectionId) {
  const { data: address } = useSkillForgeGetSkillAddress({
    collectionId
  })

  return useSkillForgePrepareContract(skillsAbi, address) as PrepareWriteContractResult<
    typeof Collection__factory.abi,
    string,
    SupportedChains
  >
}
