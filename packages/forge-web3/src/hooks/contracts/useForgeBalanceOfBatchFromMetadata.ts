import { Collection__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { Address, useContractReads } from 'wagmi'

import { SkillMetadata } from '../../types/skill'
import { WAGMI_SCOPE_KEYS } from '../constants'

type TokenDepsMap = { [key: Address]: bigint[] }
export function useForgeBalanceOfBatchFromMetadata(skillMetadata?: SkillMetadata, address?: Address) {
  const depsList = skillMetadata?.properties.dependencies
  const tokenDepsMap = depsList?.reduce((acc, dep) => {
    if (dep) {
      if (Array.isArray(acc[dep.token])) {
        acc[dep.token].push(dep.id)
      } else {
        acc[dep.token] = []
      }
    }
    return acc
  }, {} as TokenDepsMap)

  const contractReadsArgs = gatherSkillContractConfigParams(tokenDepsMap, address)

  return useContractReads({
    contracts: contractReadsArgs || [],
    watch: true,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_BALANCE_OF_BATCH_FROM_METADATA,
    // Don't run if our contract reads args list is 0
    enabled: skillMetadata && !!contractReadsArgs?.length
  })
}

function gatherSkillContractConfigParams(tokenDepsMap: TokenDepsMap | undefined = {}, balanceOfAddress?: Address) {
  const depsEntriesList = Object.entries(tokenDepsMap)
  const contractConfigList = depsEntriesList.map(([address, idsList]) => {
    if (!address || !balanceOfAddress) {
      devWarn(
        '[useBalanceOfBatchFromMetadata::gatherSkillContractConfigParams]::Dep address and/or user address undefined! Check contracts map in constants.'
      )
    }

    const args = getBalanceOfBatchArgs(idsList, balanceOfAddress)
    return {
      abi: Collection__factory.abi,
      address: address as Address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

function getBalanceOfBatchArgs(idsList: bigint[], address: Address | undefined) {
  if (!address) return [[], []]
  return idsList.reduce(
    (acc: [Address[], bigint[]], currentId: bigint) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], currentId]
      return acc
    },
    [[], []] as [Address[], bigint[]]
  )
}
