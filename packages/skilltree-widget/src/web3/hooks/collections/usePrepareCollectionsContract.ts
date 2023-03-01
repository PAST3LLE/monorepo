import { PSTLAllCollections__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'
import { useNetwork } from 'wagmi'

import { CONTRACT_ADDRESSES_MAP } from '../../constants/addresses'
import { SupportedChains } from '../../types/chains'
import { usePrepareContract } from '../usePrepareContract'

const pstlCollectionsAbi = PSTLAllCollections__factory.abi
export function usePrepareCollectionsContract(): PrepareWriteContractResult<
  typeof PSTLAllCollections__factory.abi,
  string,
  SupportedChains
> {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  return usePrepareContract(
    pstlCollectionsAbi,
    CONTRACT_ADDRESSES_MAP[chainId].collections
  ) as PrepareWriteContractResult<typeof PSTLAllCollections__factory.abi, string, SupportedChains>
}
