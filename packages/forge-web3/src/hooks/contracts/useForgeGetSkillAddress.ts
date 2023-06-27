import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithCollectionId } from '../types'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

export function useForgeGetSkillAddress({ collectionId }: WithCollectionId) {
  const [contractAddressMap] = useForgeContractAddressMapReadAtom()
  const contractAddressesByChain = useForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: contractAddressesByChain?.collectionsManager,
    functionName: 'collectionContract',
    args: [BigInt(collectionId)],
    watch: false,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT
  })
}
