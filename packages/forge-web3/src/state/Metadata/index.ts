import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { SkillId, SkillMetadata, SupportedForgeChains } from '../../types'

type MetadataMapByChain = {
  [chainId: number]: {
    [key: SkillId]: SkillMetadata
  }
}
type MetadataByChain = {
  [chainId: number]: SkillMetadata[][]
}
export interface ForgeMetadataState {
  metadata: MetadataByChain
  metadataMap: MetadataMapByChain
}

const metadataAtom = atomWithStorage<ForgeMetadataState>(STATE_STORAGE_KEYS.FORGE_METADATA_STATE, {
  metadata: {},
  metadataMap: {}
})
metadataAtom.debugLabel = 'METADATA ATOM'

const skillMetadataReadAtom = (chainId?: number) =>
  atom((get) => (chainId ? get(metadataAtom).metadata[chainId] || [] : []))
const skillMetadataWriteAtom = (chainId?: number) =>
  atom<null, ForgeMetadataState['metadata'][number]>(null, (get, set, update) => {
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
  atom<null, ForgeMetadataState['metadataMap'][number]>(null, (get, set, update) => {
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
  atom<ForgeMetadataState['metadata'][number], ForgeMetadataState['metadata'][number]>(
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

export const useForgeMetadataMapReadAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillMetadataMapReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeMetadataMapWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillMetadataMapWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeMetadataReadAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillMetadataReadAtom(chainId), [chainId])
  return useAtom(state)
}
export const useForgeMetadataWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => skillMetadataWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeMetadataReadWriteAtom = (chainId: SupportedForgeChains | undefined) => {
  const state = useMemo(() => metadataReadWriteAtom(chainId), [chainId])
  return useAtom(state)
}

export const useForgeMetadataAtom = () => {
  return useAtom(metadataAtom)
}
