import { Collection__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { ForgeMetadataState } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'

export function useForgeSkillsBalanceOfBatch(
  skills: { result?: Address }[] | undefined = [],
  metadata: ForgeMetadataState['metadata'][number],
  address?: Address,
  chainId?: number
) {
  const contractReadsArgs = useMemo(
    () => gatherSkillContractConfigParams(skills as { result?: Address }[], metadata, address),
    [skills, metadata, address]
  )

  return useContractReads({
    contracts: contractReadsArgs,
    watch: true,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_BALANCE_OF_BATCH,
    // Don't run if our contract reads args list is 0
    enabled: !!chainId && contractReadsArgs?.length > 0
  })
}

function gatherSkillContractConfigParams(
  skillsAddressList: { result?: Address }[] | undefined = [],
  metadata: ForgeMetadataState['metadata'][number],
  balanceOfAddress: Address | undefined
) {
  const contractConfigList = skillsAddressList.map(({ result: address }, idx) => {
    if (!address) {
      devWarn(
        '[SkillForgeBalancesUpdater::gatherSkillContractConfigParams]::Address undefined! Check contracts map in constants.'
      )
    }

    const args = getBalanceOfBatchArgs(metadata?.[idx] || [], balanceOfAddress)
    return {
      abi: Collection__factory.abi,
      address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

function getBalanceOfBatchArgs(
  skills: ForgeMetadataState['metadata'][number][number],
  address: Address | undefined
): [Address[], bigint[]] {
  if (!address) return [[], []]
  return skills.reduce(
    (acc: [Address[], bigint[]], skill) => {
      if (skill) {
        const [, id] = skill.properties.id.split('-')

        acc[0] = [...acc[0], address]
        acc[1] = [...acc[1], BigInt(id)]
      }
      return acc
    },
    [[], []] as [Address[], bigint[]]
  )
}
