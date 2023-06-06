import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { useSupportedChainId } from '../../hooks'
import { SkillId, SkillMetadata } from '../../types'

type MetadataMapByChain = {
  [chainId: number]: {
    [key: SkillId]: SkillMetadata
  }
}
type MetadataByChain = {
  [chainId: number]: { ids: number[]; skillsMetadata: SkillMetadata[] }[]
}
export interface SkillForgeMetadataState {
  metadata: MetadataByChain
  metadataMap: MetadataMapByChain
}

const metadataAtom = atomWithStorage<SkillForgeMetadataState>(STATE_STORAGE_KEYS.SKILLFORGE_METADATA_STATE, {
  metadata: {},
  metadataMap: {}
})
metadataAtom.debugLabel = 'METADATA ATOM'

const skillMetadataReadAtom = (chainId?: number) =>
  atom((get) => (chainId ? get(metadataAtom).metadata[chainId] || [] : []))
const skillMetadataWriteAtom = (chainId?: number) =>
  atom<null, SkillForgeMetadataState['metadata'][number]>(null, (get, set, update) => {
    if (!chainId) return
    const state = get(metadataAtom)
    return set(metadataAtom, {
      ...state,
      metadata: {
        ...state.metadata,
        [chainId]: update
      }
    })
  })

const skillMetadataMapReadAtom = (chainId?: number) =>
  atom((get) => (chainId ? get(metadataAtom).metadataMap[chainId] : {}))

const skillMetadataMapWriteAtom = (chainId?: number) =>
  atom<null, SkillForgeMetadataState['metadataMap'][number]>(null, (get, set, update) => {
    if (!chainId) return
    const state = get(metadataAtom)
    return set(metadataAtom, {
      ...state,
      metadataMap: {
        ...state.metadataMap,
        [chainId]: {
          ...state.metadataMap[chainId],
          ...update
        }
      }
    })
  })

const metadataReadWriteAtom = (chainId?: number) =>
  atom<SkillForgeMetadataState['metadata'][number], SkillForgeMetadataState['metadata'][number]>(
    (get) => (chainId ? get(metadataAtom).metadata[chainId] : []),
    (get, set, update) => {
      if (!chainId) return
      const state = get(metadataAtom)
      return set(metadataAtom, {
        ...state,
        metadata: {
          ...state.metadata,
          [chainId]: update
        }
      })
    }
  )

export const useSkillForgeMetadataMapReadAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => skillMetadataMapReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useSkillForgeMetadataMapWriteAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => skillMetadataMapWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useSkillForgeMetadataReadAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => skillMetadataReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useSkillForgeMetadataWriteAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => skillMetadataWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useSkillForgeMetadataAtom = () => {
  const chainId = useSupportedChainId()
  const state = useMemo(() => metadataReadWriteAtom(chainId), [chainId])
  return useAtom(state)
}
