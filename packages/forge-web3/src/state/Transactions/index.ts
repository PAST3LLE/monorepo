import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { SupportedForgeChains } from '../../types'

type TransactionsMapByChain = {
  [chainId: number]: {
    [key: `0x${string}`]: any
  }
}

export interface ForgeTransactionsState {
  transactionsMap: TransactionsMapByChain
}

const transactionsAtom = atomWithStorage<ForgeTransactionsState>(STATE_STORAGE_KEYS.FORGE_METADATA_STATE, {
  transactionsMap: {}
})
transactionsAtom.debugLabel = 'TRANSACTIONS ATOM'

const skillTransactionMapReadAtom = (chainId?: number) =>
  atom((get) => (chainId ? get(transactionsAtom).transactionsMap[chainId] : {}))

const skillTransactionMapWriteAtom = (chainId?: number) =>
  atom<null, ForgeTransactionsState['transactionsMap'][number]>(null, (get, set, update) => {
    if (!chainId) return
    const state = get(transactionsAtom)
    return set(transactionsAtom, {
      ...state,
      transactionsMap: {
        ...state.transactionsMap,
        [chainId]: {
          ...state.transactionsMap[chainId],
          ...update
        }
      }
    })
  })

export const useForgeTransactionMapReadAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillTransactionMapReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeTransactionMapWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillTransactionMapWriteAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeTransactionAtom = () => {
  return useAtom(transactionsAtom)
}
