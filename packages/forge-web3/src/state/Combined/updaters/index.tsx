import React, { ReactNode } from 'react'

import { AtomsDevtools } from '../../../dev/devTools'
import { ForgeW3AppConfig } from '../../../types'
import { MetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { UserBalancesUpdater } from '../../User/updaters'
import { WindowSizeUpdater } from '../../WindowSize/updaters'

export function ForgeW3StateUpdaters(props: Omit<ForgeW3AppConfig, 'web3'> & { children: ReactNode }) {
  return (
    // @ts-ignore
    <AtomsDevtools appName={props.name}>
      {/* UPDATERS */}
      <MetadataUpdater
        metadataUriMap={props.metadataUris}
        contractAddressMap={props.contractAddresses}
        idBase={props.skillOptions?.idBase}
      />
      <UserBalancesUpdater contractAddressMap={props.contractAddresses} idBase={props.skillOptions?.idBase} />
      <WindowSizeUpdater />
      {props.children}
    </AtomsDevtools>
  )
}
