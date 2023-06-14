import { SkillId, SkillMetadata, SupportedForgeChains, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'
import { useCallback } from 'react'

import { useForgesAtom } from '../state/Skills'

export function useGetSkillFromIdCallback(chainId: SupportedForgeChains | undefined) {
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)

  return useCallback((id: SkillId) => metadataMap[id], [metadataMap])
}

export function useGetActiveSkill(
  chainId: SupportedForgeChains | undefined
): null | [SkillMetadata, ReturnType<typeof useForgesAtom>[1]] {
  const getActiveSkill = useGetSkillFromIdCallback(chainId)
  const [skillState, setSkillState] = useForgesAtom()
  const {
    active: [currentlyActive]
  } = skillState

  if (!currentlyActive) return null

  const activeSkill = getActiveSkill(currentlyActive)
  return [activeSkill, setSkillState]
}
