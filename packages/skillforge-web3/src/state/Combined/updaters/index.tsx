import React, { ReactNode } from 'react'

import { AtomsDevtools } from '../../../dev/devTools'
import { SkillForgeW3AppConfig } from '../../../types'
import { SkillForgeBalancesUpdater } from '../../Balances/updaters'
import { SkillForgeMetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { SkillForgeWindowSizeUpdater } from '../../WindowSize/updaters'

export function SkillForgeW3StateUpdaters(props: Omit<SkillForgeW3AppConfig, 'web3'> & { children: ReactNode }) {
  return (
    // @ts-ignore
    <AtomsDevtools appName={props.name}>
      {/* UPDATERS */}
      <SkillForgeMetadataUpdater
        metadataUriMap={props.metadataUris}
        contractAddressMap={props.contractAddresses}
        idBase={props.skillOptions?.idBase}
      />
      <SkillForgeBalancesUpdater contractAddressMap={props.contractAddresses} idBase={props.skillOptions?.idBase} />
      <SkillForgeWindowSizeUpdater />
      {props.children}
    </AtomsDevtools>
  )
}
