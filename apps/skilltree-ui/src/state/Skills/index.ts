import { Vector } from 'components/Canvas/api/vector'
import { SkillId } from 'components/Skills/types'
import { SkillMetadata } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'

export type SkillGridPositionList = {
  vector: Vector | undefined
  skill: SkillMetadata | undefined
}[]
export type SkillVectorsMap = {
  [key: SkillId]: SkillGridPositionList[0]
}
export interface SkillsState {
  metadata: SkillMetadata[][]
  active: SkillId | undefined
  activeDependencies: SkillId[]
  vectors: SkillGridPositionList
  vectorsMap: SkillVectorsMap
}
export const skillsAtom = atom<SkillsState>({
  metadata: [],
  active: undefined,
  activeDependencies: [],
  vectors: [],
  vectorsMap: {},
})
skillsAtom.debugLabel = 'SKILLS ATOM'

export const activeSkillRead = atom((get) => get(skillsAtom))

export const useSkillsAtomRead = () => useAtom(activeSkillRead)
export const useSkillsAtom = () => useAtom(skillsAtom)
