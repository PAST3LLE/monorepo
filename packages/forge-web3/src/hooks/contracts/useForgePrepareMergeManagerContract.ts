import { MergeManager__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { SupportedForgeChains } from '../../types'
import { useSupportedChainId } from '../useForgeSupportedChainId'
import { useForgePrepareContract } from './useForgePrepareContract'

export function useForgePrepareMergeManagerContract(
  args: readonly unknown[] | undefined
): PrepareWriteContractResult<typeof MergeManager__factory.abi, string, SupportedForgeChains> {
  const [addressMap] = useForgeContractAddressMapReadAtom()
  const chainId = useSupportedChainId()
  const mergeManager = chainId ? addressMap[chainId]?.mergeManager : undefined

  return useForgePrepareContract(MergeManager__factory.abi, mergeManager, args) as PrepareWriteContractResult<
    typeof MergeManager__factory.abi,
    string,
    SupportedForgeChains
  >
}
