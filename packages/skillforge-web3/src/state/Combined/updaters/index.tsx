import { Past3lleHooksProvider } from '@past3lle/hooks'
import React, { ReactNode } from 'react'

import { AtomsDevtools } from '../../../dev/devTools'
import { SkillForgeW3AppConfig } from '../../../types'
import { SkillForgeBalancesUpdater } from '../../Balances/updaters'
import { SkillForgeMetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { SkillForgeWindowSizeUpdater } from '../../WindowSize/updaters'

export function SkillForgeW3StateUpdaters(props: Omit<SkillForgeW3AppConfig, 'web3'> & { children: ReactNode }) {
  return (
    <Past3lleHooksProvider {...props.hooksProviderOptions}>
      {/* @ts-ignore */}
      <AtomsDevtools appName={props.name}>
        {/* UPDATERS */}
        <SkillForgeMetadataUpdater
          metadataUriMap={props.metadataUris}
          contractAddressMap={props.contractAddresses}
          idBase={props.skillOptions?.idBase}
          metadataFetchOptions={props.skillOptions?.metadataFetchOptions}
        />
        <SkillForgeBalancesUpdater contractAddressMap={props.contractAddresses} idBase={props.skillOptions?.idBase} />
        <SkillForgeWindowSizeUpdater />
        {props.children}
      </AtomsDevtools>
    </Past3lleHooksProvider>
  )
}
