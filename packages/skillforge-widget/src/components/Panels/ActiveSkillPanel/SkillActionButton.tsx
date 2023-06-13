import { Text } from '@past3lle/components'
import { SkillLockStatus, SkillMetadata } from '@past3lle/forge-web3'
import React, { useMemo } from 'react'

import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { getSkillShopUri } from '../../../utils/skills'
import { ThemedButtonActions, ThemedButtonExternalLink } from '../../Common/Button'

export function SkillActionButton({
  skill,
  lockStatus,
  metadataExplorerUri
}: {
  skill: SkillMetadata
  lockStatus?: SkillLockStatus
  metadataExplorerUri: string
}) {
  const [, openSidePanel] = useSidePanelWriteAtom()
  const conditionalRenderData = useMemo(() => {
    switch (lockStatus) {
      case SkillLockStatus.OWNED:
        return (
          <ThemedButtonExternalLink fontSize="2rem" href={metadataExplorerUri}>
            <Text.Black fontWeight={300}>VIEW ON OPENSEA</Text.Black>
          </ThemedButtonExternalLink>
        )
      case SkillLockStatus.UNLOCKABLE_IN_STORE:
        return (
          <ThemedButtonExternalLink fontSize="2rem" href={getSkillShopUri(skill)}>
            <Text.Black fontWeight={300}>UNLOCK IN STORE</Text.Black>
          </ThemedButtonExternalLink>
        )
      case SkillLockStatus.UNLOCKABLE_IN_TRADE:
        return (
          <ThemedButtonActions fontSize="2rem" onClick={() => openSidePanel(`UNLOCK_SKILL::${skill.properties.id}`)}>
            <Text.Black fontWeight={300}>TRADE AND UPGRADE</Text.Black>
          </ThemedButtonActions>
        )
      case SkillLockStatus.LOCKED:
        return (
          <ThemedButtonActions fontSize="2rem" disabled>
            <Text.Black fontWeight={300}>LOCKED</Text.Black>
          </ThemedButtonActions>
        )
      default:
        return null
    }
  }, [lockStatus, metadataExplorerUri, openSidePanel, skill])

  return conditionalRenderData
}
