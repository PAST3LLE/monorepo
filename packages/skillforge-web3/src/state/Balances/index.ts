import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { SkillId } from '../../types'

export type SkillForgeBalances = {
  [key: SkillId]: string
}
export interface SkillForgeBalancesState {
  balances: SkillForgeBalances
}
const userAtom = atomWithStorage<SkillForgeBalancesState>('SKILLFORGE_BALANCES_STATE', {
  balances: {}
})
userAtom.debugLabel = 'BALANCES ATOM'

const userBalancesReadAtom = atom((get) => get(userAtom).balances)
const userBalancesWriteAtom = atom<null, SkillForgeBalancesState['balances']>(null, (get, set, update) => {
  const state = get(userAtom)
  return set(userAtom, { balances: { ...state.balances, ...update } })
})

export const useSkillForgeBalancesReadAtom = () => useAtom(userBalancesReadAtom)
export const useSkillForgeBalancesWriteAtom = () => useAtom(userBalancesWriteAtom)

export const useSkillForgeBalancesAtom = () => useAtom(userAtom)
