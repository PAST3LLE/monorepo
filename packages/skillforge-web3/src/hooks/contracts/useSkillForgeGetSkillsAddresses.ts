import { BigNumber } from '@ethersproject/bignumber'
import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useMemo } from 'react'
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

  const contractsReadsArgs = useMemo(() => {
    const commonArgs = {
      abi: CollectionsManager__factory.abi,
      address: collectionsManager,
      functionName: 'collectionContract'
    } as const

    const derivedArgs: (typeof commonArgs & { args: [number] })[] = []
    const limit = Math.max(latestCollectionId.sub(BigNumber.from(loadAmount)).toNumber(), 0)

    for (let i = latestCollectionId.toNumber(); i > limit; i--) {
      derivedArgs.push({
        ...commonArgs,
        args: [i]
      })
    }

    return derivedArgs
  }, [latestCollectionId?.toString(), loadAmount])

  return useContractReads({
    // reverse as we loop backwards
    contracts: contractsReadsArgs.reverse(),
    watch: false,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT,
    // Bug on the wagmi side is throwing (in prod) when `contracts` is an empty array
    // as it is attempting to destructure during `contracts.map(({ address <--- throws }))`
    // disable hook here if derivedArgs is an empty array
    enabled: contractsReadsArgs.length > 0
  })
}
