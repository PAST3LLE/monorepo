import { ActiveSkillUpdater } from './ActiveSkillUpdater'
import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillSquareSizeUpdater } from './SkillSquareSizeUpdater'
import React from 'react'

const SkillsUpdaters = () => (
  <>
    <GridPositionUpdater />
    <SkillSquareSizeUpdater />
    <ActiveSkillUpdater />
  </>
)

export { SkillsUpdaters }
