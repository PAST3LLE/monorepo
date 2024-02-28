import { SkillId, SupportedForgeChainIds, useSupportedChainId } from '@past3lle/forge-web3'
import { MakeOptional } from '@past3lle/types'
import { Getter, Setter, atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Hash } from 'viem'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

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
  [chainId: number]: { [account: Address]: FlowStateMap }
}

const INITIAL_STATE: ForgeFlowState = {}

const flowAtom = atomWithStorage<ForgeFlowState>(StorageKeys.FLOWS, INITIAL_STATE)
flowAtom.debugLabel = 'FLOW ATOM'

type Payload = MakeOptional<FlowState, 'hash' | 'status'>

const write = (
  chainId: number | undefined,
  address: Address | undefined,
  get: Getter,
  set: Setter,
  update: Payload
) => {
  if (!chainId || !address) return
  const state = get(flowAtom)
  const stateAtChain = state?.[chainId]
  const stateAtAddress = stateAtChain?.[address]
  return set(flowAtom, {
    ...state,
    [chainId]: {
      ...stateAtChain,
      [address]: {
        ...stateAtAddress,
        [update.id]: {
          ...stateAtAddress?.[update.id],
          ...update
        }
      }
    }
  })
}

const writeBatch = (
  chainId: number | undefined,
  address: Address | undefined,
  get: Getter,
  set: Setter,
  update: Payload
) => {
  if (!chainId || !address) return
  const state = get(flowAtom)
  return set(flowAtom, {
    ...state,
    [chainId]: {
      ...state?.[chainId],
      [address]: {
        ...state?.[chainId]?.[address],
        ...update
      }
    }
  })
}

const flowReadAtom = (chainId: number | undefined, address: Address | undefined) =>
  atom((get) => (chainId && address ? get(flowAtom)[chainId]?.[address] : {}))
const flowWriteAtom = (chainId: number | undefined, address: Address | undefined) =>
  atom(null, (get, set, update: Payload) => write(chainId, address, get, set, update))
const flowBatchWriteAtom = (chainId: number | undefined, address: Address | undefined) =>
  atom(null, (get, set, update: Payload) => writeBatch(chainId, address, get, set, update))

const flowReadWriteAtom = (chainId: number | undefined, address: Address | undefined) =>
  atom(
    (get) => (chainId && address ? get(flowAtom)[chainId]?.[address] : {}),
    (get, set, update: Payload) => write(chainId, address, get, set, update)
  )

export const useForgeFlowReadAtom = (
  chainId: SupportedForgeChainIds | undefined,
  address: Address | undefined
): [FlowStateMap, never] => {
  const state = useMemo(() => flowReadAtom(chainId, address), [chainId, address])
  return useAtom(state)
}
export const useForgeFlowWriteAtom = (chainId: SupportedForgeChainIds | undefined, address: Address | undefined) => {
  const state = useMemo(() => flowWriteAtom(chainId, address), [chainId, address])
  return useAtom(state)
}

export const useForgeFlowBatchWriteAtom = (
  chainId: SupportedForgeChainIds | undefined,
  address: Address | undefined
) => {
  const state = useMemo(() => flowBatchWriteAtom(chainId, address), [chainId, address])
  return useAtom(state)
}

export const useForgeFlowReadWriteAtom = (
  chainId: SupportedForgeChainIds | undefined,
  address: Address | undefined
) => {
  const state = useMemo(() => flowReadWriteAtom(chainId, address), [chainId, address])
  return useAtom(state)
}

export const useForgeFlowAtom = () => {
  return useAtom(flowAtom)
}

export function useFlowsMap() {
  const chainId = useSupportedChainId()
  const { address } = useAccount()
  const [flows = {}] = useForgeFlowReadAtom(chainId, address)
  return flows
}

export function usePendingFlowsRead(): FlowState[] {
  const chainId = useSupportedChainId()
  const { address } = useAccount()
  const [flows = {}] = useForgeFlowReadAtom(chainId, address)
  return useMemo(() => Object.values(flows).filter((f) => f.status !== 'claimed'), [flows])
}

export function usePendingFlows(): [FlowState[], (up: Payload) => void] {
  const chainId = useSupportedChainId()
  const { address } = useAccount()
  const [flows = {}, update] = useForgeFlowReadWriteAtom(chainId, address)
  return useMemo(() => [Object.values(flows).filter((f) => f.status !== 'claimed'), update], [flows, update])
}

export function usePendingFlowsCount() {
  const pendingFlows = usePendingFlowsRead()
  return pendingFlows.length
}
