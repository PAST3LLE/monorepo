import { SkillId, SupportedForgeChains, TransactionStatus, useSupportedChainId } from '@past3lle/forge-web3'
import { Address, MakeOptional } from '@past3lle/types'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Hash } from 'viem'

import { StorageKeys } from '../../../constants/keys'

export type FlowTransactionType = 'approve' | 'claim'
export type FlowTransactionObject = {
  skillId: SkillId
  hash: Hash
  status?: TransactionStatus
  type: 'approve' | 'claim'
  approvalsRequired: number
  transactions?: { [id: Address]: SkillId }
}

export type FlowTransactionsMap = { [hash: Hash]: FlowTransactionObject }
export interface ForgeFlowTransactionsState {
  [chain: number]: FlowTransactionsMap
}

const INITIAL_STATE: ForgeFlowTransactionsState = {}

const flowTransactionsAtom = atomWithStorage<ForgeFlowTransactionsState>(StorageKeys.FLOWS_TRANSACTIONS, INITIAL_STATE)
flowTransactionsAtom.debugLabel = 'FLOW TRANSACTIONS ATOM'

type Payload = MakeOptional<FlowTransactionObject, 'approvalsRequired' | 'status' | 'type' | 'transactions'>

const flowTransactionsReadWriteAtom = (chainId?: number) =>
  atom(
    (get) => (chainId ? get(flowTransactionsAtom)[chainId] : {}),
    (get, set, props: Payload) => {
      if (!chainId) return
      const state = get(flowTransactionsAtom)
      return set(flowTransactionsAtom, {
        ...state,
        [chainId]: {
          ...state[chainId],
          [props.skillId]: {
            ...state[chainId]?.[props.skillId],
            ...props,
            transactions: {
              ...state[chainId]?.[props.skillId]?.transactions,
              [props.hash]: props.skillId
            }
          }
        }
      })
    }
  )

export const useForgeFlowTransactionsReadWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowTransactionsReadWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeFlowTransactionsAtom = () => {
  return useAtom(flowTransactionsAtom)
}

export const useForgeFlowTransactionsMap = () => {
  const chainId = useSupportedChainId()
  const [transactions] = useForgeFlowTransactionsReadWriteAtom(chainId)
  return useMemo(() => transactions, [transactions])
}

export const usePendingFlowTransactions = () => {
  const chainId = useSupportedChainId()
  const [transactions] = useForgeFlowTransactionsReadWriteAtom(chainId)
  return useMemo(() => Object.values(transactions).filter((tx) => tx.status === 'pending'), [transactions])
}

export const useFlowTransactionUpdateCallback = () => {
  const chainId = useSupportedChainId()
  return useForgeFlowTransactionsReadWriteAtom(chainId)
}
