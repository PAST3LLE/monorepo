import { Collection__factory } from '@past3lle/skilltree-contracts'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithLoadAmount } from '../types'
import { useSupportedOrDefaultChainId } from '../useForgeSupportedChainId'
import { useForgeGetSkillsAddresses } from './useForgeGetSkillsAddresses'

export function useForgeGetBatchSkillMetadataUris({ loadAmount = BigInt(10) }: WithLoadAmount) {
  const chainId = useSupportedOrDefaultChainId()
  // get <loadAmount> of skillErc1155 addresses starting from LATEST collection
  // and counting down <loadAmount> number of times
  const { data: skillErc1155Addresses = [] } = useForgeGetSkillsAddresses({
    loadAmount
  })

  const contractsReadsArgs = useMemo(
    () =>
      (skillErc1155Addresses as { result: Address }[]).map(({ result: address }) => ({
        abi: Collection__factory.abi,
        functionName: 'uri',
        address,
        chainId,
        // ERC1155 shares same base URL, this param is required but irrelevant...
        args: [BigInt(0)]
      })),
    [chainId, skillErc1155Addresses]
  )

  return {
    uris: useContractReads({
      contracts: contractsReadsArgs,
      watch: false,
      scopeKey: WAGMI_SCOPE_KEYS.SKILLS_URI,
      enabled: contractsReadsArgs?.length > 0,
      select: (data) => data.filter(({ result }) => Boolean(result))
    }),
    addresses: skillErc1155Addresses.map((data) => data.result) as Address[]
  }
}
