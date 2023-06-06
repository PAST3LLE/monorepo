import { BigNumber } from '@ethersproject/bignumber'
import { Collection__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { ForgeMetadataState } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'

export function useForgeSkillsBalanceOfBatch(
  skills: Address[] | undefined = [],
  metadata: ForgeMetadataState['metadata'][number],
  address?: Address,
  chainId?: number
) {
  const contractReadsArgs = useMemo(
    () => gatherSkillContractConfigParams(skills as Address[], metadata, address),
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
  skillsAddressList: Address[] | undefined = [],
  metadata: ForgeMetadataState['metadata'][number],
  balanceOfAddress: Address | undefined
) {
  const contractConfigList = skillsAddressList.flatMap((address, i) => {
    if (!address) {
      devWarn(
        '[SkillForgeBalancesUpdater::gatherSkillContractConfigParams]::Address undefined! Check contracts map in constants.'
      )
    }

    const args = getBalanceOfBatchArgs(metadata?.[i]?.ids || [], balanceOfAddress)
    return {
      abi: Collection__factory.abi,
      address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

function getBalanceOfBatchArgs(ids: number[], address: Address | undefined) {
  if (!address) return [[], []]
  return ids.reduce(
    (acc: [Address[], BigNumber[]], id) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], BigNumber.from(id)]
      return acc
    },
    [[], []] as [Address[], BigNumber[]]
  )
}
