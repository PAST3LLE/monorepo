import { SkillId, SkillMetadata, SupportedForgeChains, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'
import { useCallback } from 'react'

import { useForgeSkillAtom } from '../state/Skills'

export function useGetSkillFromIdCallback(
  chainId: SupportedForgeChains | undefined
): (id: SkillId) => SkillMetadata | undefined {
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)

  return useCallback((id: SkillId) => metadataMap?.[id], [metadataMap])
}

export function useGetActiveSkill(
  chainId: SupportedForgeChains | undefined
): null | [SkillMetadata | undefined, ReturnType<typeof useForgeSkillAtom>[1]] {
  const getActiveSkill = useGetSkillFromIdCallback(chainId)
  const [skillState, setSkillState] = useForgeSkillAtom()
  const {
    active: [currentlyActive]
  } = skillState

  if (!currentlyActive) return null

  const activeSkill = getActiveSkill(currentlyActive)
  return [activeSkill, setSkillState]
}
