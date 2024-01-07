import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { Address } from 'wagmi'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import { useSupportedChainId } from '../../hooks'
import { SkillId, SkillMetadata, SupportedForgeChains } from '../../types'
import { useForgeBalancesReadAtom } from '../Balances'

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
  atom(null, (get, set, update: SkillMetadata[][]) => {
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
  atom(null, (get, set, update: MetadataMapByChain[number]) => {
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
  atom(
    (get) => (chainId ? get(metadataAtom).metadata[chainId] : []),
    (get, set, update: SkillMetadata[][]) => {
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

export const useForgeSkillsWithDependencies = () => {
  const sChainId = useSupportedChainId()
  const [skillsAtChain] = useForgeMetadataReadAtom(sChainId)
  return useMemo(() => {
    const flattenedSkillsList = skillsAtChain.flatMap((collection) => [...collection])

    return flattenedSkillsList.filter((sk) => !!sk?.properties?.dependencies?.length)
  }, [skillsAtChain])
}

export const useForgeUnclaimedSkillsWithDependencies = () => {
  const skillsWithDeps = useForgeSkillsWithDependencies()
  const [balancesMap] = useForgeBalancesReadAtom()

  return useMemo(
    () =>
      skillsWithDeps.filter((sk) => {
        const balanceAtIdString = sk?.properties?.id && balancesMap?.[sk.properties.id]
        return BigInt(balanceAtIdString || 0) < 1
      }),
    [balancesMap, skillsWithDeps]
  )
}

export const useForgeUnclaimedSkillsWithDependenciesMap = (): {
  [id: `0x${string}-${string}`]: SkillMetadata[]
} => {
  const skillsWithDeps = useForgeSkillsWithDependencies()
  const [balancesMap] = useForgeBalancesReadAtom()

  return useMemo(
    () =>
      skillsWithDeps.reduce((map, sk) => {
        const balanceAtIdString = sk?.properties?.id && balancesMap?.[sk.properties.id]
        const unclaimed = BigInt(balanceAtIdString || 0) < 1
        if (unclaimed) map[sk.properties.id] = [...(map?.[sk.properties.id] || []), sk]

        return map
      }, {} as { [id: SkillId]: SkillMetadata[] }),
    [balancesMap, skillsWithDeps]
  )
}

export const useForgeFlattenedSkillDependencies = (params?: { hideNoBalance?: boolean }) => {
  const skillsWithDeps = useForgeSkillsWithDependencies()
  const [balanceMap] = useForgeBalancesReadAtom()

  return useMemo(() => {
    return skillsWithDeps.flatMap((skill) => {
      let include = true
      if (params?.hideNoBalance) {
        const balBigInt = BigInt(balanceMap?.[skill.properties.id] || '0')
        include = balBigInt > 0
      }
      return include
        ? [
            ...(skill?.properties?.dependencies.map((dep) => ({
              ...dep,
              parentSkillId: skill.properties.id
            })) || [])
          ]
        : []
    })
  }, [balanceMap, params?.hideNoBalance, skillsWithDeps])
}

export const useForgeCollectionAddressToFlowsList = () => {
  const skillsWithDeps = useForgeSkillsWithDependencies()

  return useMemo(
    () =>
      skillsWithDeps.reduce(
        (map, sk) => {
          const deps = sk?.properties?.dependencies || []
          deps.forEach((dep) => {
            const flowsAtDep = map?.[dep.token]
            map[dep.token] = {
              ...flowsAtDep,
              [sk.properties.id]: sk
            }
          })

          return map
        },
        {} as {
          [id: Address]: {
            [id: `0x${string}-${string}`]: SkillMetadata
          }
        }
      ),
    [skillsWithDeps]
  )
}
