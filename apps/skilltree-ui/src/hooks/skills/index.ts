import { SkillId, SkillMetadata } from 'components/Skills/types'
import { useCallback } from 'react'
import { useMetadataMapReadAtom } from 'state/Metadata'
import { useSkillsAtom } from 'state/Skills'

export function useGetSkillFromIdCallback() {
  const [metadataMap] = useMetadataMapReadAtom()

  return useCallback((id: SkillId) => metadataMap[id], [metadataMap])
}

export function useGetActiveSkill(): null | [SkillMetadata, ReturnType<typeof useSkillsAtom>[1]] {
  const getActiveSkill = useGetSkillFromIdCallback()
  const [skillState, setSkillState] = useSkillsAtom()
  const {
    active: [currentlyActive]
  } = skillState

  if (!currentlyActive) return null

  const activeSkill = getActiveSkill(currentlyActive)
  return [activeSkill, setSkillState]
}
