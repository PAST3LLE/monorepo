import { Vector } from 'components/Canvas/api/vector'
import { SkillId, SkillProperties } from 'components/Skills/types'
import { SkillMetadata } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type SkillGridPositionList = {
  vector: Vector | undefined
  skill: SkillMetadata | undefined
}[]
export type SkillVectorsMap = {
  [key: SkillId]: SkillGridPositionList[0]
}
export interface SkillsState {
  active: SkillId[]
  activeDependencies: SkillProperties['dependencies']
  vectors: SkillGridPositionList
  vectorsMap: SkillVectorsMap
  sizes: { width: number; height: number }
}
const skillsAtom = atomWithStorage<SkillsState>('PSTL_SKILLS_STATE', {
  active: [],
  activeDependencies: [],
  vectors: [],
  vectorsMap: {},
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
