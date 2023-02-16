import { SkillId } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type UserBalances = {
  [key: SkillId]: string
}
export interface UserState {
  balances: UserBalances
}
const userAtom = atomWithStorage<UserState>('PSTL_USER_STATE', {
  balances: {}
})
userAtom.debugLabel = 'USER ATOM'

const userBalancesReadAtom = atom((get) => get(userAtom).balances)
const userBalancesWriteAtom = atom<null, UserState['balances']>(null, (get, set, update) => {
  const state = get(userAtom)
  return set(userAtom, { balances: { ...state.balances, ...update } })
})

export const useUserBalancesReadAtom = () => useAtom(userBalancesReadAtom)
export const useUserBalancesWriteAtom = () => useAtom(userBalancesWriteAtom)

export const useUserAtom = () => useAtom(userAtom)
