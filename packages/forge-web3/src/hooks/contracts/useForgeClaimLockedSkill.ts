import { Address } from '@past3lle/types'
import { useContractWrite } from 'wagmi'

import { useForgePrepareMergeManagerContract } from './useForgePrepareMergeManagerContract'

export function useForgeClaimLockedSkill(args: readonly { token: Address; id: number }[]) {
  const mergeManager = useForgePrepareMergeManagerContract(args)
  return useContractWrite({ ...mergeManager, functionName: 'claimLockedSkill' })
}
