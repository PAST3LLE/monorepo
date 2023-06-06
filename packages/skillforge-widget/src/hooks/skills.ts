import { SkillId, SkillMetadata, useForgeMetadataMapReadAtom } from '@past3lle/forge-web3'
import { useCallback } from 'react'

import { useForgesAtom } from '../state/Skills'

export function useGetSkillFromIdCallback() {
  const [metadataMap] = useForgeMetadataMapReadAtom()

  return useCallback((id: SkillId) => metadataMap[id], [metadataMap])
}

export function useGetActiveSkill(): null | [SkillMetadata, ReturnType<typeof useForgesAtom>[1]] {
  const getActiveSkill = useGetSkillFromIdCallback()
  const [skillState, setSkillState] = useForgesAtom()
  const {
    active: [currentlyActive]
  } = skillState

  if (!currentlyActive) return null

  const activeSkill = getActiveSkill(currentlyActive)
  return [activeSkill, setSkillState]
}
