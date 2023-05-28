import { atom, useAtom } from 'jotai'
import { Chain } from 'wagmi'

interface UserConfigState {
  chains: Chain[]
}
export const userConfigAtom = atom<UserConfigState>({
  chains: []
})
userConfigAtom.debugLabel = 'USER CONFIG ATOM'

export const supportedChainsSetter = atom<null, Chain[]>(null, (get, set, update) => {
  const state = get(userConfigAtom)
  return set(userConfigAtom, { ...state, chains: update })
})
export const supportedChainsGetter = atom((get) => get(userConfigAtom).chains)
export const useSkillForgeGetSupportedChainsAtom = () => useAtom(supportedChainsGetter)
export const useSkillForgeSetSupportedChainsAtom = () => useAtom(supportedChainsSetter)
export const useSkillForgeUserConfigAtom = () => useAtom(userConfigAtom)
