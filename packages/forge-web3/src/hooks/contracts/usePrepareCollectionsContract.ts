import { PSTLAllCollections__factory } from '@past3lle/skilltree-contracts'
import { PrepareWriteContractResult } from '@wagmi/core'
import { useNetwork } from 'wagmi'

import { ContractAddressMap, SupportedChains } from '../../types'
import { usePrepareContract } from './usePrepareContract'

const pstlCollectionsAbi = PSTLAllCollections__factory.abi
export function usePrepareCollectionsContract<M extends ContractAddressMap>(
  addressMap: M
): PrepareWriteContractResult<typeof PSTLAllCollections__factory.abi, string, SupportedChains> {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  return usePrepareContract(pstlCollectionsAbi, addressMap[chainId].collections) as PrepareWriteContractResult<
    typeof PSTLAllCollections__factory.abi,
    string,
    SupportedChains
  >
}
