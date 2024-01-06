import { SkillId, SupportedForgeChains, TransactionStatus, useSupportedChainId } from '@past3lle/forge-web3'
import { Address, MakeOptional } from '@past3lle/types'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Hash } from 'viem'
import { useAccount } from 'wagmi'

import { StorageKeys } from '../../../constants/keys'

export type FlowTransactionType = 'approve' | 'claim'
export type FlowTransactionObject = {
  skillId: SkillId
  hash: Hash
  status?: TransactionStatus
  type: 'approve' | 'claim'
  transactions?: { [id: Address]: SkillId }
}

export type FlowTransactionsMap = { [hash: Hash]: FlowTransactionObject }
export interface ForgeFlowTransactionsState {
  [chain: number]: { [account: Address]: FlowTransactionsMap }
}

const INITIAL_STATE: ForgeFlowTransactionsState = {}

const flowTransactionsAtom = atomWithStorage<ForgeFlowTransactionsState>(StorageKeys.FLOWS_TRANSACTIONS, INITIAL_STATE)
flowTransactionsAtom.debugLabel = 'FLOW TRANSACTIONS ATOM'

type Payload = MakeOptional<FlowTransactionObject, 'status' | 'type' | 'transactions'>

const flowTransactionsReadWriteAtom = (chainId?: number, address?: Address) =>
  atom(
    (get) => (chainId && address ? get(flowTransactionsAtom)[chainId]?.[address] : {}),
    (get, set, props: Payload) => {
      if (!chainId || !address) return
      const state = get(flowTransactionsAtom)
      const stateAtChain: ForgeFlowTransactionsState[number] | undefined = state?.[chainId]
      const stateAtAccount: FlowTransactionsMap | undefined = (stateAtChain || {})?.[address]
      return set(flowTransactionsAtom, {
        ...state,
        [chainId]: {
          ...stateAtChain,
          [address]: {
            ...stateAtAccount,
            [props.skillId]: {
              ...stateAtAccount?.[props.skillId],
              ...props,
              transactions: {
                ...stateAtAccount?.[props.skillId]?.transactions,
                [props.hash]: props.skillId
              }
            }
          }
        }
      })
    }
  )

export const useForgeFlowTransactionsReadWriteAtom = (
  chainId: SupportedForgeChains | undefined,
  address: Address | undefined
) => {
  const state = useMemo(() => flowTransactionsReadWriteAtom(chainId, address), [chainId, address])
  return useAtom(state)
}

export const useForgeFlowTransactionsAtom = () => {
  return useAtom(flowTransactionsAtom)
}

export const useForgeFlowTransactionsMap = (): FlowTransactionsMap => {
  const chainId = useSupportedChainId()
  const { address } = useAccount()
  const [transactions] = useForgeFlowTransactionsReadWriteAtom(chainId, address)
  return useMemo(() => (address ? transactions?.[address] : {}), [address, transactions])
}

export const usePendingFlowTransactions = () => {
  const chainId = useSupportedChainId()
  const { address } = useAccount()
  const [transactions] = useForgeFlowTransactionsReadWriteAtom(chainId, address)
  return useMemo(() => Object.values(transactions).filter((tx) => tx.status === 'pending'), [transactions])
}

export const useFlowTransactionUpdateCallback = (): [FlowTransactionsMap, (props: Payload) => void] => {
  const chainId = useSupportedChainId()
  const { address } = useAccount()

  const [state, callback] = useForgeFlowTransactionsReadWriteAtom(chainId, address)
  return useMemo(() => [address ? state?.[address] : {}, callback], [address, callback, state])
}
