import { AnyTransactionReceipt, SkillId, useW3TransactionsByMetadataKey } from '@past3lle/forge-web3'
import { useEffect } from 'react'
import { Hash } from 'viem'

import { FlowState, FlowStatus, useFlowsMap, usePendingFlows } from '../state'
import { useUpdateFlowsOnBlock } from '../state/hooks'
import { FlowTransactionType, useFlowTransactionUpdateCallback } from '../state/transactions'

export function FlowsUpdater() {
  const forgeTransactions = useW3TransactionsByMetadataKey('forgeSkillId')
  const [, updateFlows] = usePendingFlows()
  const flowMap = useFlowsMap()
  const [flowTransactionsMap, updateTransaction] = useFlowTransactionUpdateCallback()

  useEffect(() => {
    forgeTransactions.forEach((web3Tx) => {
      // Find existing flow tx
      const existingFlowTx = web3Tx.metadata?.forgeSkillId
        ? flowMap[web3Tx.metadata?.forgeSkillId as SkillId]
        : undefined
      const skillIdKey: SkillId | undefined =
        existingFlowTx?.id || (web3Tx.metadata?.forgeSkillId as SkillId | undefined)
      // Find existing flow sub tx (approve)
      const existingFlowSubTx = skillIdKey ? flowTransactionsMap?.[skillIdKey] : undefined

      // Update flow sub tx
      if (skillIdKey) {
        updateTransaction({
          skillId: skillIdKey,
          hash: (existingFlowSubTx?.hash || web3Tx?.safeTxHash || web3Tx?.transactionHash) as Hash,
          status: web3Tx.status || 'pending',
          type: (existingFlowSubTx?.type || web3Tx?.metadata?.forgeTransactionType) as FlowTransactionType
        })
      }

      updateFlows({
        id: (existingFlowTx?.id || web3Tx?.metadata?.forgeSkillId) as SkillId,
        hash: web3Tx.transactionHash,
        status: _getFlowTxStatus(existingFlowTx, web3Tx)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgeTransactions])

  // Update flows on block (optimistic)
  useUpdateFlowsOnBlock()

  return null
}

function _getFlowTxStatus(flowTx: FlowState | undefined, web3Tx: AnyTransactionReceipt): FlowStatus {
  if (!flowTx && !web3Tx?.metadata?.forgeTransactionType)
    throw new Error(
      '[@past3lle/skillforge-widget -- _getFlowTxStatus] No detected flow tx status or transaction metadata statuses.'
    )

  // At this point flowTx.status is defined...
  switch (web3Tx.status) {
    case 'success':
    case 'replaced-success':
      return flowTx?.status === 'approving' || web3Tx?.metadata?.forgeTransactionType === 'approve'
        ? 'claimable'
        : flowTx?.status === 'claiming' || web3Tx?.metadata?.forgeTransactionType === 'claim'
        ? 'claimed'
        : 'needs-approvals'
    default:
      return flowTx?.status === 'approving'
        ? 'approved'
        : flowTx?.status === 'claiming'
        ? 'claimed'
        : web3Tx?.metadata?.forgeTransactionType === 'approve'
        ? 'approving'
        : web3Tx?.metadata?.forgeTransactionType === 'claim'
        ? 'claiming'
        : 'needs-approvals'
  }
}
