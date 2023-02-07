import { GridPositionUpdater } from './GridPositionUpdater'
import { SkillsMetadataUpdater } from './MetadataUpdater'
import React from 'react'

const SkillsUpdaters = () => (
  <>
    <SkillsMetadataUpdater />
    <GridPositionUpdater />
  </>
)

export { SkillsMetadataUpdater, SkillsUpdaters }
