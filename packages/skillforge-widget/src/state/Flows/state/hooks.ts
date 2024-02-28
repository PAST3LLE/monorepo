import {
  useForgeBalancesReadAtom,
  useForgeGetLockedSkillsApprovalStatuses,
  useSupportedChainId
} from '@past3lle/forge-web3'
import { useAccount } from 'wagmi'

import { useForgeFlowReadWriteAtom } from './flows'
import { useFlowTransactionUpdateCallback } from './transactions'

export function useUpdateFlowsOnBlock() {
  const chainId = useSupportedChainId()
  const { address } = useAccount()

  const [flows, updateFlows] = useForgeFlowReadWriteAtom(chainId, address)
  const [transactions, updateTransaction] = useFlowTransactionUpdateCallback()

  const [balancesMap] = useForgeBalancesReadAtom()

  useForgeGetLockedSkillsApprovalStatuses({
    enabled: !!address,
    async onIterationSuccess(data) {
      const [cFlow, hasSkill] = [
        flows?.[data.parentSkillId],
        balancesMap?.[data.parentSkillId] && BigInt(balancesMap[data.parentSkillId]) > 0
      ]
      const flowStatus = !data.approved ? 'needs-approvals' : hasSkill ? 'claimed' : 'claimable'
      const depId = `${data.token}-${data.id}`
      const isDep = data.parentSkillId !== depId
      const transactionsList = transactions?.[data.parentSkillId]?.transactions
      updateFlows({
        ...cFlow,
        hash: !cFlow ? '0x' : cFlow.hash,
        id: data.parentSkillId,
        status: flowStatus
      })
      !!address &&
        flowStatus !== 'claimed' &&
        !transactionsList?.[data.token] &&
        updateTransaction({
          type: 'approve',
          hash: data.token,
          status: isDep && !data.approved ? 'pending' : 'success',
          skillId: data.parentSkillId
        })
    }
  })
}
