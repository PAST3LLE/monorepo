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
  sizes: { width: number; height: number }
}
const skillsAtom = atom<SkillsState>({
  metadata: [],
  active: undefined,
  activeDependencies: [],
  vectors: [],
  vectorsMap: {},
  sizes: { width: 0, height: 0 },
})
skillsAtom.debugLabel = 'SKILLS ATOM'

const activeSkillRead = atom((get) => get(skillsAtom).active)

const skillSizeWriteAtom = atom<null, SkillsState['sizes']>(null, (get, set, update) => {
  const state = get(skillsAtom)
  return set(skillsAtom, { ...state, sizes: update })
})
const skillSizeReadAtom = atom<SkillsState['sizes']>((get) => get(skillsAtom).sizes)

const skillMetadataReadAtom = atom((get) => get(skillsAtom).metadata)
const skillMetadataWriteAtom = atom<null, SkillsState['metadata']>(null, (get, set, update) => {
  const state = get(skillsAtom)
  return set(skillsAtom, { ...state, metadata: update })
})

export const useSkillMetadataReadAtom = () => useAtom(skillMetadataReadAtom)
export const useSkillMetadataWriteAtom = () => useAtom(skillMetadataWriteAtom)

export const useSkillSizeWriteAtom = () => useAtom(skillSizeWriteAtom)
export const useSkillSizeReadAtom = () => useAtom(skillSizeReadAtom)

export const useActiveSkillReadAtom = () => useAtom(activeSkillRead)
export const useSkillsAtom = () => useAtom(skillsAtom)
