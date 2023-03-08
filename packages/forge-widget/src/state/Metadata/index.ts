import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { SkillId, SkillMetadata } from '../../types'

type MetadataMap = {
  [key: SkillId]: SkillMetadata
}
export interface MetadataState {
  metadata: { size: number; skillsMetadata: SkillMetadata[] }[]
  metadataMap: MetadataMap
}

const metadataAtom = atomWithStorage<MetadataState>('PSTL_METADATA_STATE', {
  metadata: [],
  metadataMap: {}
})
metadataAtom.debugLabel = 'METADATA ATOM'
const skillMetadataReadAtom = atom((get) => get(metadataAtom).metadata)
const skillMetadataWriteAtom = atom<null, MetadataState['metadata']>(null, (get, set, update) => {
  const state = get(metadataAtom)
  return set(metadataAtom, { ...state, metadata: update })
})

const skillMetadataMapReadAtom = atom((get) => get(metadataAtom).metadataMap)
const skillMetadataMapWriteAtom = atom<null, MetadataState['metadataMap']>(null, (get, set, update) => {
  const state = get(metadataAtom)
  return set(metadataAtom, { ...state, metadataMap: { ...state.metadataMap, ...update } })
})

export const useMetadataMapReadAtom = () => useAtom(skillMetadataMapReadAtom)
export const useMetadataMapWriteAtom = () => useAtom(skillMetadataMapWriteAtom)

export const useMetadataReadAtom = () => useAtom(skillMetadataReadAtom)
export const useMetadataWriteAtom = () => useAtom(skillMetadataWriteAtom)
export const useMetadataAtom = () => useAtom(metadataAtom)
