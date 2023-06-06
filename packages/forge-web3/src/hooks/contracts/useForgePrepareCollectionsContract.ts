import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { SupportedForgeChains } from '../../types'
import { useSupportedChainId } from '../useForgeSupportedChainId'
import { useForgePrepareContract } from './useForgePrepareContract'

const pstlCollectionsAbi = CollectionsManager__factory.abi
export function useForgePrepareCollectionsContract(): PrepareWriteContractResult<
  typeof CollectionsManager__factory.abi,
  string,
  SupportedForgeChains
> {
  const [addressMap] = useForgeContractAddressMapReadAtom()
  const chainId = useSupportedChainId()
  const collectionsManager = chainId ? addressMap[chainId]?.collectionsManager : undefined

  return useForgePrepareContract(pstlCollectionsAbi, collectionsManager) as PrepareWriteContractResult<
    typeof CollectionsManager__factory.abi,
    string,
    SupportedForgeChains
  >
}
