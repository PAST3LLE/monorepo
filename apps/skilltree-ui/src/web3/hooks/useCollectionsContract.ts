import { CONTRACT_ADDRESSES_MAP } from '../constants/addresses'
import { SupportedChains } from '../types/chains'
import { PSTLAllCollections__factory } from '@past3lle/skilltree-contracts'
import { useNetwork, usePrepareContractWrite } from 'wagmi'

const pstlCollectionsAbi = PSTLAllCollections__factory.abi
export function usePrepareCollectionsContract() {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  const { config } = usePrepareContractWrite({
    abi: pstlCollectionsAbi,
    chainId,
    address: CONTRACT_ADDRESSES_MAP[chainId].collections,
  })

  return config
}
