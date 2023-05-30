import { BigNumber } from '@ethersproject/bignumber'
import { Collection__factory } from '@past3lle/skilltree-contracts'
import { SkillForgeMetadataUpdaterProps } from 'src/state/Metadata/updaters/MetadataUpdater'
import { useContractRead } from 'wagmi'

import { WAGMI_SCOPE_KEYS } from '../constants'
import { useSkillForgeGetSkillAddress } from './useSkillForgeGetSkillAddress'

type GetSkillMetadataUriProps = Pick<SkillForgeMetadataUpdaterProps, 'contractAddressMap'> & { collectionId: number }
export function useSkillForgeGetSkillMetadataUri({ collectionId, contractAddressMap }: GetSkillMetadataUriProps) {
  const { data: address } = useSkillForgeGetSkillAddress({
    collectionId,
    contractAddressMap
  })

  return useContractRead({
    abi: Collection__factory.abi,
    functionName: 'uri',
    address,
    // ERC1155 shares same base URL, this param is required but irrelevant...
    args: [BigNumber.from(0)],
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_URI
  })
}
