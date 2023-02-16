import { SkillMetadata } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface MetadataState {
  metadata: SkillMetadata[][]
}

const metadataAtom = atomWithStorage<MetadataState>('PSTL_METADATA_STATE', {
  metadata: []
})
metadataAtom.debugLabel = 'METADATA ATOM'
const skillMetadataReadAtom = atom((get) => get(metadataAtom).metadata)
const skillMetadataWriteAtom = atom<null, MetadataState['metadata']>(null, (get, set, update) => {
  const state = get(metadataAtom)
  return set(metadataAtom, { ...state, metadata: update })
})

export const useMetadataReadAtom = () => useAtom(skillMetadataReadAtom)
export const useMetadataWriteAtom = () => useAtom(skillMetadataWriteAtom)
export const useMetadataAtom = () => useAtom(metadataAtom)
