import { Collection__factory } from '@past3lle/skilltree-contracts'
import { useContractRead } from 'wagmi'

import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithCollectionId } from '../types'
import { useForgeGetSkillAddress } from './useForgeGetSkillAddress'

export function useForgeGetSkillMetadataUri({ collectionId }: WithCollectionId) {
  const { data: address } = useForgeGetSkillAddress({
    collectionId
  })

  return useContractRead({
    abi: Collection__factory.abi,
    functionName: 'uri',
    address,
    // ERC1155 shares same base URL, this param is required but irrelevant...
    args: [BigInt(0)],
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_URI
  })
}
