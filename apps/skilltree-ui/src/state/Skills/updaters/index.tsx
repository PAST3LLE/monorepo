import { ActiveSkillUpdater } from './ActiveSkillUpdater'
import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillsMetadataUpdater } from './MetadataUpdater'
import { SkillSquareSizeUpdater } from './SkillSquareSizeUpdater'
import React from 'react'

const SkillsUpdaters = () => (
  <>
    <SkillsMetadataUpdater />
    <GridPositionUpdater />
    <SkillSquareSizeUpdater />
    <ActiveSkillUpdater />
  </>
)

export { SkillsMetadataUpdater, SkillsUpdaters }
