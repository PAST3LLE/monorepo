import { SkillId } from 'components/Skills/types'
import { SkillMetadata } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'

interface SkillsState {
  metadata: SkillMetadata[][]
  active: SkillId | undefined
  activeDependencies: SkillId[]
}
export const skillsAtom = atom<SkillsState>({
  metadata: [],
  active: undefined,
  activeDependencies: [],
})
skillsAtom.debugLabel = 'SKILLS ATOM'

export const activeSkillRead = atom((get) => get(skillsAtom))

export const useSkillsAtomRead = () => useAtom(activeSkillRead)
export const useSkillsAtom = () => useAtom(skillsAtom)
