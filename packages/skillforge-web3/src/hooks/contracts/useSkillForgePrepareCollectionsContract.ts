import { PSTLAllCollections__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'
import { useNetwork } from 'wagmi'

import { SkillForgeContractAddressMap, SupportedChains } from '../../types'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const pstlCollectionsAbi = PSTLAllCollections__factory.abi
export function useSkillForgePrepareCollectionsContract<M extends SkillForgeContractAddressMap>(
  addressMap: M
): PrepareWriteContractResult<typeof PSTLAllCollections__factory.abi, string, SupportedChains> {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  return useSkillForgePrepareContract(
    pstlCollectionsAbi,
    addressMap[chainId].collections
  ) as PrepareWriteContractResult<typeof PSTLAllCollections__factory.abi, string, SupportedChains>
}
