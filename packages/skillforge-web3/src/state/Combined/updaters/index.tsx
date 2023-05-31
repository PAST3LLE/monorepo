import React, { ReactNode } from 'react'

import { AtomsDevtools } from '../../../dev/devTools'
import { SkillForgeW3AppConfig } from '../../../types'
import { SkillForgeBalancesUpdater } from '../../Balances/updaters'
import { SkillForgeMetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { SkillForgeUserConfigUpdater } from '../../UserConfig/updaters'
import { SkillForgeWindowSizeUpdater } from '../../WindowSize/updaters'

export function SkillForgeW3StateUpdaters(props: SkillForgeW3AppConfig & { children: ReactNode }) {
  return (
    // @ts-ignore
    <AtomsDevtools appName={props.name}>
      {/* UPDATERS */}
      <SkillForgeUserConfigUpdater
        chains={props.web3.chains}
        metadataFetchOptions={props.skillOptions?.metadataFetchOptions}
      />
      <SkillForgeMetadataUpdater
        metadataUriMap={props.metadataUris}
        contractAddressMap={props.contractAddresses}
        metadataFetchOptions={props.skillOptions?.metadataFetchOptions}
      />
      <SkillForgeBalancesUpdater contractAddressMap={props.contractAddresses} />
      <SkillForgeWindowSizeUpdater />
      {props.children}
    </AtomsDevtools>
  )
}
