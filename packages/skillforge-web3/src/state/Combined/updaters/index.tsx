import React, { ReactNode } from 'react'

import { AtomsDevtoolsUpdater } from '../../../dev/devTools'
import { SkillForgeW3AppConfig } from '../../../types'
import { SkillForgeBalancesUpdater } from '../../Balances/updaters'
import { SkillForgeMetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { SkillForgeUserConfigUpdater } from '../../UserConfig/updaters'
import { SkillForgeVersionAndCacheBustUpdater } from '../../Version/updaters'
import { SkillForgeWindowSizeUpdater } from '../../WindowSize/updaters'

export function SkillForgeW3StateUpdaters(props: SkillForgeW3AppConfig & { children: ReactNode }) {
  return (
    <>
      <AtomsDevtoolsUpdater appName={props.name} />
      {/* UPDATERS */}
      <SkillForgeVersionAndCacheBustUpdater />
      <SkillForgeUserConfigUpdater {...props} />
      <SkillForgeMetadataUpdater metadataFetchOptions={props.skillOptions?.metadataFetchOptions} />
      <SkillForgeBalancesUpdater />
      <SkillForgeWindowSizeUpdater />
      {props.children}
    </>
  )
}
