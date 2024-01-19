import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useMemo } from 'react'
import { useReadContracts } from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithLoadAmount } from '../types'
import { useSupportedOrDefaultChainId } from '../useForgeSupportedChainId'
import { useRefetchOnAddressAndChain } from '../useRefetchOnAddress'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'
import { useForgeGetLatestCollectionId } from './useForgeGetLatestCollectionId'

const DEFAULT_LATEST_COLLECTION = BigInt(2)
export function useForgeGetSkillsAddresses({ loadAmount }: WithLoadAmount) {
  const chainId = useSupportedOrDefaultChainId()
  const [contractAddressMap] = useForgeContractAddressMapReadAtom()
  const contractAddressesByChain = useForgeContractAddressesByChain(contractAddressMap)
  const { data: latestCollectionId = DEFAULT_LATEST_COLLECTION, refetch: refetchCollectionId } =
    useForgeGetLatestCollectionId(contractAddressMap)

  useRefetchOnAddressAndChain(refetchCollectionId)

  const contractsReadsArgs = useMemo(() => {
    const commonArgs = {
      abi: CollectionsManager__factory.abi,
      address: contractAddressesByChain?.collectionsManager,
      functionName: 'collectionContract',
      chainId
    } as const

    const derivedArgs: (typeof commonArgs & { args: [bigint] })[] = []
    const limit = Math.max(Number(BigInt(latestCollectionId) - BigInt(loadAmount)), 0)

    for (let i = latestCollectionId; i > limit; i--) {
      derivedArgs.push({
        ...commonArgs,
        args: [i]
      })
    }

    return derivedArgs.reverse()
  }, [chainId, contractAddressesByChain?.collectionsManager, latestCollectionId, loadAmount])

  return useReadContracts({
    // reverse as we loop backwards
    contracts: contractsReadsArgs,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT,
    // Bug on the wagmi side is throwing (in prod) when `contracts` is an empty array
    // as it is attempting to destructure during `contracts.map(({ address <--- throws }))`
    // disable hook here if derivedArgs is an empty array
    query: { enabled: contractsReadsArgs.length > 0 }
  })
}
