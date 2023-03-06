import React from 'react'

import { ActiveSkillUpdater } from './ActiveSkillUpdater'
import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillSquareSizeUpdater } from './SkillSquareSizeUpdater'

export const SkillsUpdaters = () => (
  <>
    <GridPositionUpdater />
    <SkillSquareSizeUpdater />
    <ActiveSkillUpdater />
  </>
)
