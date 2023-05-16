import { BigNumber } from '@ethersproject/bignumber'
import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { SkillForgeContractAddressMap } from '../../types'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'

interface FetchSkillAddressesProps {
  contractAddressMap: SkillForgeContractAddressMap
  collectionId: number
}
export function useSkillForgeGetSkillAddress(props: FetchSkillAddressesProps) {
  const { collectionId, contractAddressMap } = props

  const { collectionsManager } = useSkillForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: collectionsManager,
    functionName: 'skillsContract',
    args: [BigNumber.from(collectionId)],
    watch: true
  })
}
