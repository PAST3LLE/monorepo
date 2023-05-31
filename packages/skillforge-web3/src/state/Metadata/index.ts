import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { SkillId, SkillMetadata } from '../../types'

type MetadataMap = {
  [key: SkillId]: SkillMetadata
}
export interface SkillForgeMetadataState {
  metadata: { ids: number[]; skillsMetadata: SkillMetadata[] }[]
  metadataMap: MetadataMap
}

const metadataAtom = atomWithStorage<SkillForgeMetadataState>(STATE_STORAGE_KEYS.SKILLFORGE_METADATA_STATE, {
  metadata: [],
  metadataMap: {}
})
metadataAtom.debugLabel = 'METADATA ATOM'
const skillMetadataReadAtom = atom((get) => get(metadataAtom).metadata)
const skillMetadataWriteAtom = atom<null, SkillForgeMetadataState['metadata']>(null, (get, set, update) => {
  const state = get(metadataAtom)
  return set(metadataAtom, { ...state, metadata: update })
})

const skillMetadataMapReadAtom = atom((get) => get(metadataAtom).metadataMap)
const skillMetadataMapWriteAtom = atom<null, SkillForgeMetadataState['metadataMap']>(null, (get, set, update) => {
  const state = get(metadataAtom)
  return set(metadataAtom, { ...state, metadataMap: { ...state.metadataMap, ...update } })
})

export const useSkillForgeMetadataMapReadAtom = () => useAtom(skillMetadataMapReadAtom)
export const useSkillForgeMetadataMapWriteAtom = () => useAtom(skillMetadataMapWriteAtom)

export const useSkillForgeMetadataReadAtom = () => useAtom(skillMetadataReadAtom)
export const useSkillForgeMetadataWriteAtom = () => useAtom(skillMetadataWriteAtom)
export const useSkillForgeMetadataAtom = () => useAtom(metadataAtom)
