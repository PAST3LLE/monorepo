import { Column } from '@past3lle/components'
import { SkillLockStatus, SkillMetadata } from '@past3lle/forge-web3'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { MAIN_COLOR } from '../BaseSidePanel/styleds'

const LockedSkillInstructionsWrapper = styled(Column)`
  justify-content: flex-start;
  align-items: center;
  color: ${MAIN_COLOR};
  font-size: 1.7rem;
  font-variation-settings: 'wght' 1000;
  letter-spacing: -1px;

  text-shadow: -1px 3px 0px #db9bfa66;
  box-shadow: 0px 0px 15px 2px #c0e36e59;

  overflow-y: auto;
  max-height: 300px;

  background: #00000099;
  border-radius: 10px;

  padding: 1rem;
  text-transform: uppercase;

  a {
    text-shadow: none;
  }

  > ol {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 20px;
  }
`
function LockedSkillInstructions({ title, content }: { title: string; content: string | TrustedHTML }) {
  return (
    <Column gap="1rem">
      {title}
      <LockedSkillInstructionsWrapper dangerouslySetInnerHTML={{ __html: content }} />
    </Column>
  )
}

export function getSkillDescription(skill: SkillMetadata | undefined, lockStatus: SkillLockStatus) {
  const { name, properties } = skill || {}
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return "You can't get this skill yet. Click/view required skill(s) below."
    case SkillLockStatus.UNLOCKABLE_IN_STORE: {
      const unlockInstructions = properties?.unlockInstructions
      const isCollection = properties?.isCollection

      return (
        (unlockInstructions && (
          <LockedSkillInstructions title={`${name || 'Skill'} LOCKED!`} content={unlockInstructions} />
        )) ||
        (isCollection ? `Unlock ${name || 'this collection'}` : `Get ${name || 'this skill'}`) +
          ' from the shop and earn a new skill giving you access to exclusive perks.'
      )
    }
    case SkillLockStatus.UNLOCKABLE_IN_TRADE:
      return `Trade in the required skills below and receive your upgraded ${
        name || ''
      } skill. Get ready to access exclusive perks!`
    case SkillLockStatus.OWNED: {
      return (
        <>
          Nice, you already own {name || 'this skill'}. <br />
          What now? Head to the shop to get new pieces and earn more skills and unlock newer, better, more exclusive
          gear and their skills. Time to skill-up!
        </>
      )
    }
    default:
      return 'Skill information missing. Please try again later.'
  }
}

export function getLockStatusColour(lockStatus: SkillLockStatus, theme: DefaultTheme) {
  switch (lockStatus) {
    case SkillLockStatus.LOCKED:
      return '#8b0000'
    case SkillLockStatus.UNLOCKABLE_IN_STORE:
      return '#006400'
    case SkillLockStatus.UNLOCKABLE_IN_TRADE:
      return '#e46cff'
    case SkillLockStatus.OWNED:
      return theme.mainBg
  }
}
