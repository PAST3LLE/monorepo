import { atom, useAtom } from 'jotai'

interface SkillsState {
  active: string | undefined
}
export const skillsAtom = atom<SkillsState>({
  active: undefined,
})

export const activeSkillRead = atom((get) => get(skillsAtom))

export const useSkillsAtomRead = () => useAtom(activeSkillRead)
export const useSkillsAtom = () => useAtom(skillsAtom)
