import { BigNumber } from '@ethersproject/bignumber'
import { Skills__factory } from '@past3lle/skilltree-contracts'
import { SkillForgeMetadataUpdaterProps } from 'src/state/Metadata/updaters/MetadataUpdater'
import { useContractRead } from 'wagmi'

import { useSkillForgeGetSkillAddress } from './useSkillForgeGetSkillAddress'

type GetSkillMetadataUriProps = Pick<SkillForgeMetadataUpdaterProps, 'contractAddressMap'> & { collectionId: number }
export function useSkillForgeGetSkillMetadataUri({ collectionId, contractAddressMap }: GetSkillMetadataUriProps) {
  const { data: address } = useSkillForgeGetSkillAddress({
    collectionId,
    contractAddressMap
  })

  return useContractRead({
    abi: Skills__factory.abi,
    functionName: 'uri',
    address,
    // ERC1155 shares same base URL, this param is required but irrelevant...
    args: [BigNumber.from(0)]
  })
}
