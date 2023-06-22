import { SkillId } from '@past3lle/forge-web3'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Vector } from '../../../api/vector'

export type SkillGridPositionList = {
  vector: Vector | undefined
  skillId: SkillId | undefined
}[]
export type SkillVectorsMap = {
  [key: SkillId]: SkillGridPositionList[0]
}
export interface VectorsState {
  dimensions: {
    rows: number
    columns: number
    rowHeight: number
    columnWidth: number
    gridHeight: number
    gridWidth: number
  } | null
  vectors: SkillGridPositionList
  vectorsMap: SkillVectorsMap
}
const vectorsAtom = atomWithStorage<VectorsState>('SKILLFORGE_VECTORS_STATE', {
  dimensions: null,
  vectors: [],
  vectorsMap: {}
})
vectorsAtom.debugLabel = 'VECTORS ATOM'

const vectorsReadAtom = atom((get) => get(vectorsAtom).vectors)
const vectorsWriteAtom = atom<null, VectorsState['vectors']>(null, (get, set, update) => {
  const state = get(vectorsAtom)
  return set(vectorsAtom, { ...state, vectors: update })
})

const vectorsMapReadAtom = atom((get) => get(vectorsAtom).vectorsMap)
const vectorsMapWriteAtom = atom<null, VectorsState['vectorsMap']>(null, (get, set, update) => {
  const state = get(vectorsAtom)
  return set(vectorsAtom, { ...state, vectorsMap: update })
})

export const useVectorsAtom = () => useAtom(vectorsAtom)

export const useVectorsReadAtom = () => useAtom(vectorsReadAtom)
export const useVectorsWriteAtom = () => useAtom(vectorsWriteAtom)

export const useVectorsMapReadAtom = () => useAtom(vectorsMapReadAtom)
export const useVectorsMapWriteAtom = () => useAtom(vectorsMapWriteAtom)
