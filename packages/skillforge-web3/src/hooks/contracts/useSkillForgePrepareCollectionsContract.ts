import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { SkillForgeContractAddressMap, SupportedChains } from '../../types'
import { useSupportedChainId } from '../useSkillForgeSupportedChainId'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const pstlCollectionsAbi = CollectionsManager__factory.abi
export function useSkillForgePrepareCollectionsContract<M extends SkillForgeContractAddressMap>(
  addressMap: M
): PrepareWriteContractResult<typeof CollectionsManager__factory.abi, string, SupportedChains> {
  const chainId = useSupportedChainId()

  return useSkillForgePrepareContract(
    pstlCollectionsAbi,
    addressMap[chainId || SupportedChains.GOERLI].collectionsManager
  ) as PrepareWriteContractResult<typeof CollectionsManager__factory.abi, string, SupportedChains>
}
