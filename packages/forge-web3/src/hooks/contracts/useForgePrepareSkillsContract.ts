import { Collection__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { SupportedForgeChains } from '../../types'
import { WithCollectionId } from '../types'
import { useForgeGetSkillAddress } from './useForgeGetSkillAddress'
import { useForgePrepareContract } from './useForgePrepareContract'

const skillsAbi = Collection__factory.abi
export function useForgePrepareSkillsContract({ collectionId }: WithCollectionId) {
  const { data: address } = useForgeGetSkillAddress({
    collectionId
  })

  return useForgePrepareContract(skillsAbi, address) as PrepareWriteContractResult<
    typeof Collection__factory.abi,
    string,
    SupportedForgeChains
  >
}
