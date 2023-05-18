import { BigNumber } from '@ethersproject/bignumber'
import { Skills__factory } from '@past3lle/skilltree-contracts'
import { SkillForgeMetadataUpdaterProps } from 'src/state/Metadata/updaters/MetadataUpdater'
import { Address, useContractReads } from 'wagmi'

import { WAGMI_SCOPE_KEYS } from '../constants'
import { useSkillForgeGetSkillsAddresses } from './useSkillForgeGetSkillsAddresses'

type GetSkillMetadataUriProps = Pick<SkillForgeMetadataUpdaterProps, 'contractAddressMap' | 'loadAmount'>
export function useSkillForgeGetBatchSkillMetadataUris({
  loadAmount = 10,
  contractAddressMap
}: GetSkillMetadataUriProps) {
  // get <loadAmount> of skillErc1155 addresses starting from LATEST collection
  // and counting down <loadAmount> number of times
  const { data: skillErc1155Addresses = [] } = useSkillForgeGetSkillsAddresses({
    loadAmount,
    contractAddressMap
  })

  const paramsList = (skillErc1155Addresses as Address[]).map((address) => ({
    abi: Skills__factory.abi,
    functionName: 'uri',
    address,
    // ERC1155 shares same base URL, this param is required but irrelevant...
    args: [BigNumber.from(0)]
  }))
  return {
    uris: useContractReads({
      contracts: paramsList,
      watch: true,
      scopeKey: WAGMI_SCOPE_KEYS.SKILLS_URI
    }),
    addresses: skillErc1155Addresses
  }
}
