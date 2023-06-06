import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { useSupportedChainId } from '../../hooks'
import { SkillId } from '../../types'

export type ForgeBalances = {
  [chainId: number]: {
    [key: SkillId]: string
  }
}
export interface ForgeBalancesState {
  balances: ForgeBalances
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userAtom = atomWithStorage<ForgeBalancesState>(STATE_STORAGE_KEYS.FORGE_BALANCES_STATE, {
  balances: {}
})
userAtom.debugLabel = 'BALANCES ATOM'

const userBalancesReadAtom = (chainId?: number) => atom((get) => (chainId ? get(userAtom).balances[chainId] : {}))

const userBalancesWriteAtom = atom<null, ForgeBalancesState['balances']>(null, (get, set, update) => {
  const state = get(userAtom)
  return set(userAtom, {
    balances: {
      ...state.balances,
      ...update
    }
  })
})

const userBalancesResetAtom = (chainId?: number) =>
  atom<null, ForgeBalancesState['balances']>(null, (get, set) => {
    const state = get(userAtom)
    if (!chainId) return
    const resetBalancesByChain = Object.keys(state.balances[chainId]).reduce((acc, next) => {
      acc[next as SkillId] = '0'
      return acc
    }, {} as ForgeBalances[number])
    // reduce state.balances and make all values 0
    return set(userAtom, {
      balances: {
        ...state.balances,
        [chainId]: resetBalancesByChain
      }
    })
  })
userBalancesResetAtom.debugLabel = 'BALANCES RESET ATOM'

export const useForgeBalancesReadAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => userBalancesReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeBalancesWriteAtom = () => useAtom(userBalancesWriteAtom)

export const useForgeBalancesAtom = () => {
  return useAtom(userAtom)
}

export const useForgeResetBalancesAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => userBalancesResetAtom(chainId), [chainId])
  return useAtom(state)
}
