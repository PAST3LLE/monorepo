import { SkillId } from '@past3lle/skillforge-web3'
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

const skillSizeWriteAtom = atom<null, SkillsState['sizes']>(null, (get, set, update) => {
  const state = get(skillsAtom)
  return set(skillsAtom, { ...state, sizes: update })
})
const skillSizeReadAtom = atom<SkillsState['sizes']>((get) => get(skillsAtom).sizes)

export const useSkillSizeWriteAtom = () => useAtom(skillSizeWriteAtom)
export const useSkillSizeReadAtom = () => useAtom(skillSizeReadAtom)

export const useActiveSkillReadAtom = () => useAtom(activeSkillRead)
export const useSkillsAtom = () => useAtom(skillsAtom)
