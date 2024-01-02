import { SkillId, SupportedForgeChains, useSupportedChainId } from '@past3lle/forge-web3'
import { MakeOptional } from '@past3lle/types'
import { Getter, Setter, atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Hash } from 'viem'

import { StorageKeys } from '../../../constants/keys'

export type FlowStatus = 'claimed' | 'claimable' | 'claiming' | 'needs-approvals' | 'approving' | 'approved'
export interface FlowState {
  id: SkillId
  status: FlowStatus
  hash: Hash
}

export interface FlowStateMap {
  [key: SkillId]: FlowState
}

export interface ForgeFlowState {
  [chainId: number]: FlowStateMap
}

const INITIAL_STATE: ForgeFlowState = {}

const flowAtom = atomWithStorage<ForgeFlowState>(StorageKeys.FLOWS, INITIAL_STATE)
flowAtom.debugLabel = 'FLOW ATOM'

type Payload = MakeOptional<FlowState, 'hash' | 'status'>

const write = (chainId: number | undefined, get: Getter, set: Setter, update: Payload) => {
  if (!chainId) return
  const state = get(flowAtom)
  return set(flowAtom, {
    ...state,
    [chainId]: {
      ...state[chainId],
      [update.id]: {
        ...state[chainId][update.id],
        ...update
      }
    }
  })
}

const writeBatch = (chainId: number | undefined, get: Getter, set: Setter, update: Payload) => {
  if (!chainId) return
  const state = get(flowAtom)
  return set(flowAtom, {
    ...state,
    [chainId]: update
  })
}

const flowReadAtom = (chainId?: number) => atom((get) => (chainId ? get(flowAtom)[chainId] : {}))
const flowWriteAtom = (chainId?: number) => atom(null, (get, set, update: Payload) => write(chainId, get, set, update))
const flowBatchWriteAtom = (chainId?: number) =>
  atom(null, (get, set, update: Payload) => writeBatch(chainId, get, set, update))

const flowReadWriteAtom = (chainId?: number) =>
  atom(
    (get) => (chainId ? get(flowAtom)[chainId] : {}),
    (get, set, update: Payload) => write(chainId, get, set, update)
  )

// const flowTransactionsMapWriteAtom = (chainId?: number) =>
//   atom(
//     null,
//     (
//       get,
//       set,
//       update: {
//         hash: Hash
//         skillId: SkillId
//         key: keyof FlowTransactionObject
//         value: FlowTransactionObject[keyof FlowTransactionObject]
//       }
//     ) => {
//       if (!chainId) return
//       const state = get(flowAtom)
//       return set(flowAtom, {
//         ...state,
//         [chainId]: {
//           ...state[chainId],
//           [update.id]: {
//             ...state[chainId][update.id],
//             transactionsMap: {
//               ...state[chainId][update.id].transactionsMap,
//               [update.hash]: {
//                 ...state[chainId][update.id].transactionsMap?.[update.hash],
//                 [update.key]: update.value
//               }
//             }
//           }
//         }
//       })
//     }
//   )

export const useForgeFlowReadAtom = (chainId: SupportedForgeChains | undefined): [FlowStateMap, never] => {
  const state = useMemo(() => flowReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeFlowWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeFlowBatchWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowBatchWriteAtom(chainId), [chainId])
  return useAtom(state)
}

// export const useForgeForgeTransactionsMapKeyValueAtom = (chainId: SupportedForgeChains | undefined) => {
//   const state = useMemo(() => flowTransactionsMapWriteAtom(chainId), [chainId])
//   return useAtom(state)
// }

export const useForgeFlowReadWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowReadWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeFlowAtom = () => {
  return useAtom(flowAtom)
}

export function useFlowsMap() {
  const chainId = useSupportedChainId()
  const [flows = {}] = useForgeFlowReadAtom(chainId)
  return useMemo(() => flows, [flows])
}

export function usePendingFlowsRead(): FlowState[] {
  const chainId = useSupportedChainId()
  const [flows = {}] = useForgeFlowReadAtom(chainId)
  return useMemo(() => Object.values(flows).filter((f) => f.status !== 'claimed'), [flows])
}

export function usePendingFlows(): [FlowState[], (up: Payload) => void] {
  const chainId = useSupportedChainId()
  const [flows = {}, update] = useForgeFlowReadWriteAtom(chainId)
  return useMemo(() => [Object.values(flows).filter((f) => f.status !== 'claimed'), update], [flows, update])
}

export function usePendingFlowsCount() {
  const pendingFlows = usePendingFlowsRead()
  return pendingFlows.length
}
