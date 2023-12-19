import { SkillId } from '@past3lle/forge-web3'
import { atom, useAtom } from 'jotai'

export interface SkillsState {
  active: SkillId[]
  activeDependencies: SkillId[]
  sizes: { width: number; height: number }
}
const skillsAtom = atom<SkillsState>({
  active: [],
  activeDependencies: [],
  sizes: { width: 0, height: 0 }
})
skillsAtom.debugLabel = 'SKILLS ATOM'

const activeSkillRead = atom((get) => get(skillsAtom).active)

const skillSizeWriteAtom = atom(null, (get, set, update: SkillsState['sizes']) => {
  const state = get(skillsAtom)
  return set(skillsAtom, { ...state, sizes: update })
})
const skillSizeReadAtom = atom<SkillsState['sizes']>((get) => get(skillsAtom).sizes)

const activeSkillAtom = atom(
  (get) => get(skillsAtom).active,
  (get, set, update: SkillsState['active'][number]) => {
    const state = get(skillsAtom)
    return set(skillsAtom, { ...state, active: [update, ...state.active] })
  }
)

const activeDependenciesSkillAtom = atom(
  (get) => get(skillsAtom).activeDependencies,
  (get, set, update: SkillsState['activeDependencies'][number]) => {
    const state = get(skillsAtom)
    return set(skillsAtom, { ...state, activeDependencies: [update, ...state.activeDependencies] })
  }
)

export const useActiveSkillAtom = () => useAtom(activeSkillAtom)
export const useActiveSkillDependenciesAtom = () => useAtom(activeDependenciesSkillAtom)

export const useForgeSizeWriteAtom = () => useAtom(skillSizeWriteAtom)
export const useForgeSizeReadAtom = () => useAtom(skillSizeReadAtom)

export const useActiveSkillReadAtom = () => useAtom(activeSkillRead)
export const useForgesAtom = () => useAtom(skillsAtom)
