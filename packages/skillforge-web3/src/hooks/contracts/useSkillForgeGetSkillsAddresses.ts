import { BigNumber } from '@ethersproject/bignumber'
import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractReads } from 'wagmi'

import { SkillForgeContractAddressMap } from '../../types'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { useRefetchOnAddress } from '../useRefetchOnAddress'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'
import { useSkillForgeGetLatestCollectionId } from './useSkillForgeGetLatestCollectionId'

interface FetchSkillAddressesProps {
  loadAmount: number
  contractAddressMap: SkillForgeContractAddressMap
}
export function useSkillForgeGetSkillsAddresses(props: FetchSkillAddressesProps) {
  const { loadAmount, contractAddressMap } = props

  const { collectionsManager } = useSkillForgeContractAddressesByChain(contractAddressMap)
  const { data: latestCollectionId = BigNumber.from(1), refetch: refetchCollectionId } =
    useSkillForgeGetLatestCollectionId(contractAddressMap)

  useRefetchOnAddress(refetchCollectionId)

  const commonArgs = {
    abi: CollectionsManager__factory.abi,
    address: collectionsManager,
    functionName: 'skillsContract'
  } as const

  const limit = Math.max(latestCollectionId.sub(BigNumber.from(loadAmount)).toNumber(), 0)
  const derivedArgs: (typeof commonArgs & { args: [number] })[] = []

  for (let i = latestCollectionId.toNumber(); i > limit; i--) {
    derivedArgs.push({
      ...commonArgs,
      args: [i]
    })
  }

  return useContractReads({
    // reverse as we loop backwards
    contracts: derivedArgs.reverse(),
    watch: true,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT
  })
}
