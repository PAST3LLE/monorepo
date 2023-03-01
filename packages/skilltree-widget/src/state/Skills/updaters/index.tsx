import React from 'react'

import { ActiveSkillUpdater } from './ActiveSkillUpdater'
import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillSquareSizeUpdater } from './SkillSquareSizeUpdater'

const SkillsUpdaters = () => (
  <>
    <GridPositionUpdater />
    <SkillSquareSizeUpdater />
    <ActiveSkillUpdater />
  </>
)

export { SkillsUpdaters }
