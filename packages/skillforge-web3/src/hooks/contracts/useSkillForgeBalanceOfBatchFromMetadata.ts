import { BigNumber } from '@ethersproject/bignumber'
import { Skills__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { Address, useContractReads } from 'wagmi'

import { SkillMetadata } from '../../types/skill'
import { WAGMI_SCOPE_KEYS } from '../constants'

type TokenDepsMap = { [key: Address]: BigNumber[] }
export function useSkillForgeBalanceOfBatchFromMetadata(skillMetadata: SkillMetadata, address?: Address) {
  const depsList = skillMetadata?.properties.dependencies || []
  const tokenDepsMap = depsList.reduce((acc, dep) => {
    if (dep) {
      if (Array.isArray(acc[dep.token])) {
        acc[dep.token].push(dep.id)
      } else {
        acc[dep.token] = []
      }
    }
    return acc
  }, {} as TokenDepsMap)

  /*
    address = 0x12312312SomeRandomAddressGuy
    tokenDepsMap = {
        '0x123123SkillAddress_123123': [1000,2000,5000],
        '0xAAB123SkillAddress_222444': [5000,7000]
    }
  */

  const contractReadsArgs = gatherSkillContractConfigParams(tokenDepsMap, address)

  return useContractReads({
    contracts: contractReadsArgs,
    watch: true,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_BALANCE_OF_BATCH_FROM_METADATA,
    // Don't run if our contract reads args list is 0
    enabled: contractReadsArgs?.length > 0
  })
}

function gatherSkillContractConfigParams(tokenDepsMap: TokenDepsMap, balanceOfAddress?: Address) {
  if (!balanceOfAddress) return []
  const contractConfigList = Object.entries(tokenDepsMap).map(([address, idsList]) => {
    if (!address) {
      devWarn(
        '[useBalanceOfBatchFromMetadata::gatherSkillContractConfigParams]::Dep address undefined! Check contracts map in constants.'
      )
      return undefined
    }

    const args = getBalanceOfBatchArgs(idsList, balanceOfAddress)
    return {
      abi: Skills__factory.abi,
      address: address as Address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

function getBalanceOfBatchArgs(idsList: BigNumber[], address: Address) {
  return idsList.reduce(
    (acc: [Address[], BigNumber[]], currentId: BigNumber) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], currentId]
      return acc
    },
    [[], []] as [Address[], BigNumber[]]
  )
}
