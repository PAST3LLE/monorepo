import { Column, Text } from '@past3lle/components'
import { SkillMetadata } from '@past3lle/forge-web3'
import { OFF_WHITE } from '@past3lle/theme'
import { darken } from 'polished'
import React from 'react'
import { useTheme } from 'styled-components'

import { ThemedButtonActions } from '../../Common/Button'
import { SkillRarityLabel } from '../ActiveSkillPanel/styleds'

export function TradeAndUnlockActionButton({ skill, handleClaim }: { skill: SkillMetadata; handleClaim?: () => void }) {
  const theme = useTheme()

  return (
    <Column justifyContent={'center'} gap="0.75rem" width={'40%'}>
      <ThemedButtonActions fontSize="2rem" disabled={!handleClaim} onClick={handleClaim}>
        <Text.Black fontWeight={300}>{'CONFIRM UPGRADE'}</Text.Black>
      </ThemedButtonActions>
      <SkillRarityLabel
        backgroundColor={darken(0.02, theme.rarity[skill.properties.rarity].backgroundColor)}
        color={OFF_WHITE}
        fontSize="2rem"
        fontWeight={100}
        borderRadius="0.3rem"
        marginLeft="0"
        width="100%"
        style={{ gap: '0.5rem' }}
        textShadow={`1px 1px 1px ${darken(0.3, theme.rarity[skill.properties.rarity].backgroundColor)}`}
        justifyContent="flex-start"
      >
        <img src={theme.assetsMap.icons.rarity[skill.properties.rarity]} style={{ maxWidth: '2.5rem' }} />
        <strong>{skill.properties.rarity?.toLocaleUpperCase()}</strong> SKILL
      </SkillRarityLabel>
    </Column>
  )
}
