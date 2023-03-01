import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Vector } from '../../components/SkillsCanvas/Canvas/api/vector'
import { SkillId, SkillProperties } from '../../types'

export type SkillGridPositionList = {
  vector: Vector | undefined
  skillId: SkillId | undefined
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
