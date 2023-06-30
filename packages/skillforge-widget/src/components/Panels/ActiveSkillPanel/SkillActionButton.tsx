import { Column, Text } from '@past3lle/components'
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
          <Column alignItems={'center'} gap="1rem" maxWidth={'40%'}>
            <ThemedButtonExternalLink fullWidth href={getSkillShopUri(skill)}>
              <Text.Black fontSize="1.6rem" fontWeight={300}>
                VIEW IN SHOP
              </Text.Black>
            </ThemedButtonExternalLink>
            <ThemedButtonExternalLink fullWidth href={metadataExplorerUri}>
              <Text.Black fontSize="1.6rem" fontWeight={300}>
                VIEW ON OPENSEA
              </Text.Black>
            </ThemedButtonExternalLink>
          </Column>
        )
      case SkillLockStatus.UNLOCKABLE_IN_STORE:
        return (
          <ThemedButtonExternalLink fullWidth fontSize="2rem" href={getSkillShopUri(skill)}>
            <Text.Black fontWeight={300}>UNLOCK IN SHOP</Text.Black>
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
