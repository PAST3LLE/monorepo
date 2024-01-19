import { SkillId, SkillMetadata, SupportedForgeChainIds, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'
import { useCallback } from 'react'

import { useForgeSkillAtom } from '../state/Skills'

export function useGetSkillFromIdCallback(
  chainId: SupportedForgeChainIds | undefined
): (id: SkillId) => SkillMetadata | undefined {
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)

  return useCallback((id: SkillId) => metadataMap?.[id], [metadataMap])
}

export function useGetActiveSkill(
  chainId: SupportedForgeChainIds | undefined
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
