import { BigNumber } from '@ethersproject/bignumber'
import { CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { useSkillForgeContractAddressMapReadAtom } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithCollectionId } from '../types'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'

export function useSkillForgeGetSkillAddress({ collectionId }: WithCollectionId) {
  const [contractAddressMap] = useSkillForgeContractAddressMapReadAtom()
  const contractAddressesByChain = useSkillForgeContractAddressesByChain(contractAddressMap)

  return useContractRead({
    abi: CollectionsManager__factory.abi,
    address: contractAddressesByChain?.collectionsManager,
    functionName: 'collectionContract',
    args: [BigNumber.from(collectionId)],
    watch: false,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT
  })
}
