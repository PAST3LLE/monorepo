import React from 'react'

import { Skillpoint } from '.'
import { SKILLPOINT_METADATA } from '../../constants/skills'

export function SkillpointPoint() {
  return (
    <Skillpoint
      hasSkill
      metadata={SKILLPOINT_METADATA}
      skillpointStyles={{ css: `overflow: hidden; img { transform: scale(1.5) translateY(3px); }` }}
    />
  )
}
