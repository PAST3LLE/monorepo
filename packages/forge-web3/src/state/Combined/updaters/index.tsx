import React, { ReactNode } from 'react'

import { AtomsDevtoolsUpdater } from '../../../dev/devTools'
import { ForgeChainsMinimum, ForgeW3AppConfig } from '../../../types'
import { ForgeBalancesUpdater } from '../../Balances/updaters'
import { ForgeMetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { ForgeUserConfigUpdater } from '../../UserConfig/updaters'
import { ForgeVersionAndCacheBustUpdater } from '../../Version/updaters'
import { ForgeWindowSizeUpdater } from '../../WindowSize/updaters'

export function ForgeW3StateUpdaters(props: ForgeW3AppConfig<ForgeChainsMinimum> & { children: ReactNode }) {
  return (
    <>
      <AtomsDevtoolsUpdater appName={props.name} />
      {/* UPDATERS */}
      <ForgeVersionAndCacheBustUpdater />
      <ForgeUserConfigUpdater {...props} />
      <ForgeMetadataUpdater metadataFetchOptions={props.skillOptions?.metadataFetchOptions} />
      <ForgeBalancesUpdater />
      <ForgeWindowSizeUpdater {...props.options?.windowSizeOptions} />
      {props.children}
    </>
  )
}
