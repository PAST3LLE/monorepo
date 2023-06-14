import { Column, Text } from '@past3lle/components'
import { SkillMetadata, useForgeClaimLockedSkill } from '@past3lle/forge-web3'
import { OFF_WHITE } from '@past3lle/theme'
import { Address } from '@past3lle/types'
import { devDebug } from '@past3lle/utils'
import { darken } from 'polished'
import React from 'react'
import { useTheme } from 'styled-components'

import { ThemedButtonActions } from '../../Common/Button'
import { SkillRarityLabel } from '../ActiveSkillPanel/styleds'

export function TradeAndUnlockActionButton({ skill }: { skill: SkillMetadata }) {
  const theme = useTheme()
  const [token, id] = skill.properties.id.split('-')
  const { data, write, isLoading } = useForgeClaimLockedSkill([
    {
      token: token as Address,
      id: Number(id)
    }
  ])
  devDebug('[Skillforge-Widget]::TradeAndUnlockActionButton::WRITE:', write)
  devDebug('[Skillforge-Widget]::TradeAndUnlockActionButton::DATA:', data)
  return (
    <Column justifyContent={'center'} gap="0.75rem">
      <ThemedButtonActions fontSize="2rem" disabled={!write || isLoading} onClick={write}>
        <Text.Black fontWeight={300}>{isLoading ? 'UPGRADE IN PROGRESS...' : 'CONFIRM UPGRADE'}</Text.Black>
      </ThemedButtonActions>
      <SkillRarityLabel
        backgroundColor={darken(0.02, theme.rarity[skill.properties.rarity].backgroundColor)}
        color={OFF_WHITE}
        fontSize="2rem"
        fontWeight={100}
        borderRadius="0.3rem"
        marginLeft="0"
        width="100%"
        textShadow={`1px 1px 1px ${darken(0.3, theme.rarity[skill.properties.rarity].backgroundColor)}`}
        justifyContent="flex-start"
      >
        <img
          src={theme.assetsMap.icons.rarity[skill.properties.rarity]}
          style={{ maxWidth: '2.5rem', marginRight: '0.3rem' }}
        />
        <strong>{skill.properties.rarity?.toLocaleUpperCase()}</strong> SKILL
      </SkillRarityLabel>
    </Column>
  )
}
