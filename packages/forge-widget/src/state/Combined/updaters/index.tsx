import { ThemeModesRequired, ThemeProviderSimple, useConstructTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components'

import { AtomsDevtools } from '../../../dev/devTools'
import { AppThemeMode, useAppThemeModeRead } from '../../Theme'
import { AppConfig } from '../../../types'
import { MetadataUpdater } from '../../Metadata/updaters/MetadataUpdater'
import { SidePanelUpdater } from '../../SidePanel/updaters'
import { SkillsUpdaters } from '../../Skills/updaters'
import { ThemeUpdater } from '../../Theme/updaters'
import { UserBalancesUpdater } from '../../User/updaters'
import { WindowSizeUpdater } from '../../WindowSize/updaters'

export function SkilltreeCoreUpdaters(props: Omit<AppConfig, 'provider'> & { children: ReactNode }) {
  const [mode] = useAppThemeModeRead()
  const theme = useConstructTheme({
    theme: props.appTheme,
    mode: mode as ThemeModesRequired
  })

  return (
    // @ts-ignore
    <AtomsDevtools appName={props.appName}>
      {/* UPDATERS */}
      <MetadataUpdater />
      <UserBalancesUpdater />
      <SkillsUpdaters />
      <WindowSizeUpdater />
      <ThemeProviderSimple theme={theme as DefaultTheme}>
        <ThemeUpdater mode={theme.mode as AppThemeMode} />
        <SidePanelUpdater />
        {props.children}
      </ThemeProviderSimple>
    </AtomsDevtools>
  )
}
