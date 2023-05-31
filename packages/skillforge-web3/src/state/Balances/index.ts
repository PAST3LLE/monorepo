import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { SkillId } from '../../types'

export type SkillForgeBalances = {
  [key: SkillId]: string
}
export interface SkillForgeBalancesState {
  balances: SkillForgeBalances
}
const userAtom = atomWithStorage<SkillForgeBalancesState>(STATE_STORAGE_KEYS.SKILLFORGE_BALANCES_STATE, {
  balances: {}
})
userAtom.debugLabel = 'BALANCES ATOM'

const userBalancesReadAtom = atom((get) => get(userAtom).balances)
const userBalancesWriteAtom = atom<null, SkillForgeBalancesState['balances']>(null, (get, set, update) => {
  const state = get(userAtom)
  return set(userAtom, { balances: { ...state.balances, ...update } })
})

const userBalancesResetAtom = atom<null, SkillForgeBalancesState['balances']>(null, (get, set) => {
  const state = get(userAtom)
  // reduce state.balances and make all values 0
  return set(userAtom, {
    balances: Object.keys(state.balances).reduce((acc, next) => {
      acc[next as SkillId] = '0'
      return acc
    }, {} as SkillForgeBalances)
  })
})

export const useSkillForgeBalancesReadAtom = () => useAtom(userBalancesReadAtom)
export const useSkillForgeBalancesWriteAtom = () => useAtom(userBalancesWriteAtom)

export const useSkillForgeBalancesAtom = () => useAtom(userAtom)

export const useSkillForgeResetBalancesAtom = () => useAtom(userBalancesResetAtom)
