import { SkillLockStatus } from '@past3lle/forge-web3'
import React from 'react'
import { DefaultTheme } from 'styled-components'

export function getSkillDescription(name: string | undefined, lockStatus: SkillLockStatus) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return "You can't get this skill yet. Click/view required skill(s) below."
    case SkillLockStatus.UNLOCKABLE_IN_STORE:
      return `Buy ${name || 'this skill'} in the shop and receive a free skill giving you access to exclusive perks.`
    case SkillLockStatus.UNLOCKABLE_IN_TRADE:
      return `Trade in the required skills below and receive your upgraded ${
        name || ''
      } skill giving you access to exclusive perks.`
    case SkillLockStatus.OWNED:
      return (
        <>
          Nice, you already own {name || 'this skill'}. <br />
          What now? Head to the shop to get new pieces and earn more skills and unlock newer, more exclusive skills!
        </>
      )
    default:
      return 'Skill information missing. Please try again later.'
  }
}

export function getLockStatusColour(lockStatus: SkillLockStatus, theme: DefaultTheme) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return 'darkred'
    case SkillLockStatus.UNLOCKABLE_IN_STORE:
      return 'darkgreen'
    case SkillLockStatus.UNLOCKABLE_IN_TRADE:
      return '#e46cff'
    case SkillLockStatus.OWNED:
      return theme.mainBg
  }
}
