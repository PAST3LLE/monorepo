import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillsMetadataUpdater } from './MetadataUpdater'
import { SkillSquareSizeUpdater } from './SkillSquareSizeUpdater'
import React from 'react'

const SkillsUpdaters = () => (
  <>
    <SkillsMetadataUpdater />
    <GridPositionUpdater />
    <SkillSquareSizeUpdater />
  </>
)

export { SkillsMetadataUpdater, SkillsUpdaters }
