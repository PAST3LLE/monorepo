import { BigNumber } from '@ethersproject/bignumber'
import { Collection__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { SkillForgeMetadataState } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'

export function useSkillForgeSkillsBalanceOfBatch(
  skills: Address[] | undefined = [],
  metadata: SkillForgeMetadataState['metadata'],
  address?: Address
) {
  const contractReadsArgs = useMemo(
    () => (address ? gatherSkillContractConfigParams(skills as Address[], metadata, address) : []),
    [skills, metadata, address]
  )

  return useContractReads({
    contracts: contractReadsArgs,
    watch: true,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_BALANCE_OF_BATCH,
    // Don't run if our contract reads args list is 0
    enabled: contractReadsArgs?.length > 0
  })
}

function gatherSkillContractConfigParams(
  skillsAddressList: Address[] | undefined = [],
  metadata: SkillForgeMetadataState['metadata'],
  balanceOfAddress: Address
) {
  const contractConfigList = skillsAddressList.flatMap((address, i) => {
    if (!address) {
      devWarn(
        '[SkillForgeBalancesUpdater::gatherSkillContractConfigParams]::Address undefined! Check contracts map in constants.'
      )
      return undefined
    }

    const args = getBalanceOfBatchArgs(metadata[i]?.ids || [], balanceOfAddress)
    return {
      abi: Collection__factory.abi,
      address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

function getBalanceOfBatchArgs(ids: number[], address: Address) {
  return ids.reduce(
    (acc: [Address[], BigNumber[]], id) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], BigNumber.from(id)]
      return acc
    },
    [[], []] as [Address[], BigNumber[]]
  )
}
