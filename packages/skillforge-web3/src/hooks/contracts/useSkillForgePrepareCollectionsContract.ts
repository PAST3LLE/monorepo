import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { useSkillForgeContractAddressMapReadAtom } from '../../state'
import { SupportedChains } from '../../types'
import { useSupportedChainId } from '../useSkillForgeSupportedChainId'
import { useSkillForgePrepareContract } from './useSkillForgePrepareContract'

const pstlCollectionsAbi = CollectionsManager__factory.abi
export function useSkillForgePrepareCollectionsContract(): PrepareWriteContractResult<
  typeof CollectionsManager__factory.abi,
  string,
  SupportedChains
> {
  const [addressMap] = useSkillForgeContractAddressMapReadAtom()
  const chainId = useSupportedChainId()

  return useSkillForgePrepareContract(
    pstlCollectionsAbi,
    addressMap?.[chainId || SupportedChains.GOERLI]?.collectionsManager
  ) as PrepareWriteContractResult<typeof CollectionsManager__factory.abi, string, SupportedChains>
}
