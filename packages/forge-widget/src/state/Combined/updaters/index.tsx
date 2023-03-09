import { ForgeW3ConnectedProviders, ForgeW3DataProviders } from '@past3lle/forge-web3'
import { ThemeProviderSimple, useConstructTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components'

import { ForgeWidgetAppConfig } from '../../../types'
import { SidePanelUpdater } from '../../SidePanel/updaters'
import { SkillsUpdaters } from '../../Skills/updaters'
import { AppThemeMode, useAppThemeModeRead } from '../../Theme'
import { ThemeUpdater } from '../../Theme/updaters'

export function SkilltreeThemeAndDataProviders(props: ForgeWidgetAppConfig & { children: ReactNode }) {
  const [mode] = useAppThemeModeRead()
  const theme = useConstructTheme({
    theme: props.theme,
    mode
  })

  return (
    <>
      <SkillsUpdaters />
      <ThemeProviderSimple theme={theme as DefaultTheme}>
        <ThemeUpdater mode={theme.mode as AppThemeMode} />
        <SidePanelUpdater />
        {props.children}
      </ThemeProviderSimple>
    </>
  )
}

export function SkilltreeDisconnectedDataProviders({
  children,
  ...props
}: ForgeWidgetAppConfig & { children: ReactNode }) {
  return (
    <ForgeW3DataProviders config={props}>
      <SkilltreeThemeAndDataProviders {...props}>{children}</SkilltreeThemeAndDataProviders>
    </ForgeW3DataProviders>
  )
}

export function SkilltreeConnectedDataProviders({
  children,
  ...props
}: ForgeWidgetAppConfig & { children: ReactNode }) {
  return (
    <ForgeW3ConnectedProviders config={props}>
      <SkilltreeThemeAndDataProviders {...props}>{children}</SkilltreeThemeAndDataProviders>
    </ForgeW3ConnectedProviders>
  )
}
