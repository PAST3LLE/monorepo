import { SkillId, SupportedForgeChains, useSupportedChainId } from '@past3lle/forge-web3'
import { Getter, Setter, atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Hash } from 'viem'
import { Address } from 'wagmi'

import { StorageKeys } from '../../constants/keys'

type FlowTransactionObject = {
  collectionAddress: Address
  hash: Hash
  type: 'prerequisite-approve' | 'claimable-approve' | 'claim'
}
export type FlowStatus = 'claimed' | 'claimable' | 'claiming' | 'needs-approvals' | 'approving' | 'approved'
export interface FlowState {
  status: FlowStatus
  // Record of: Key: token to be approved address & Value: tx hash
  transactionsMap?: Record<Address, FlowTransactionObject>
  transactions?: FlowTransactionObject[]
}

export interface ForgeFlowState {
  [chainId: number]: {
    [key: SkillId]: FlowState
  }
}

export interface Payload {
  skillId: SkillId
  approvingSkillId?: Address
  status: FlowState['status']
}

// Map of token id's that are being unlocked and claimed to transactions needed to unlock it

const INITIAL_STATE: ForgeFlowState = {
  [5]: {
    ['0x40430F926F26105758715676cae59A62689fb490-1000']: {
      status: 'needs-approvals',
      transactions: [
        {
          collectionAddress: '0xeC7c69f8CBB0b9f5e7ce904C01eD57329dC78b21',
          hash: '0xd8150c53eda45f41b2c7ce60deb07ad644447c52f3ff7ca0345dd27fc9443450',
          type: 'prerequisite-approve'
        }
      ]
    },
    ['0xeC7c69f8CBB0b9f5e7ce904C01eD57329dC78b21-1000']: {
      status: 'claimed'
    },
    ['0x40430F926F26105758715676cae59A62689fb490-3000']: {
      status: 'claimable'
    },
    ['0x40430F926F26105758715676cae59A62689fb490-2000']: {
      status: 'needs-approvals',
      transactions: [
        {
          collectionAddress: '0x40430F926F26105758715676cae59A62689fb490',
          hash: '0x72b6a2e1932164b32e0d013c4c0c71b6c96691fba7fc9dbc3952eb3fd2d292b2',
          type: 'claimable-approve'
        }
      ]
    }
  }
}

const flowAtom = atomWithStorage<ForgeFlowState>(StorageKeys.FLOWS, INITIAL_STATE)
flowAtom.debugLabel = 'FLOW ATOM'

const write = (chainId: number | undefined, get: Getter, set: Setter, update: Payload) => {
  if (!chainId) return
  const state = get(flowAtom)
  const skillIdApprovalLib = state?.[chainId]?.[update.skillId]?.transactions || {}
  return set(flowAtom, {
    ...state,
    [chainId]: {
      ...state[chainId],
      [update.skillId]: {
        status: update.status,
        approvalInProgress: update.approvingSkillId
          ? {
              ...skillIdApprovalLib,
              [update.approvingSkillId]: true
            }
          : skillIdApprovalLib
      }
    }
  })
}

const flowReadAtom = (chainId?: number) => atom((get) => (chainId ? get(flowAtom)[chainId] : {}))
const flowWriteAtom = (chainId?: number) => atom(null, (get, set, update: Payload) => write(chainId, get, set, update))

const flowReadWriteAtom = (chainId?: number) =>
  atom(
    (get) => (chainId ? get(flowAtom)[chainId] : {}),
    (get, set, update: Payload) => write(chainId, get, set, update)
  )

export const useForgeFlowReadAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeForgeWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeFlowReadWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => flowReadWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeFlowAtom = () => {
  return useAtom(flowAtom)
}

export function usePendingFlows() {
  const chainId = useSupportedChainId()
  const [flows = {}] = useForgeFlowReadAtom(chainId)
  return useMemo(() => Object.values(flows).filter((f) => f.status !== 'claimed'), [flows])
}

export function usePendingFlowsCount() {
  const pendingFlows = usePendingFlows()
  return pendingFlows.length
}
