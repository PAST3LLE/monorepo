import { ForgeW3ConnectedProviders, ForgeW3DataProviders } from '@past3lle/skillforge-web3'
import { ThemeProviderSimple, useConstructTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components'

import { SkillForgeWidgetConfig } from '../../../types'
import { SidePanelUpdater } from '../../SidePanel/updaters'
import { SkillsUpdaters } from '../../Skills/updaters'
import { AppThemeMode, useAppThemeModeRead } from '../../Theme'
import { ThemeUpdater } from '../../Theme/updaters'

export function SkillForgeThemeAndDataProviders(props: SkillForgeWidgetConfig & { children: ReactNode }) {
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

export function SkillForgeDisconnectedDataProviders({
  children,
  ...props
}: SkillForgeWidgetConfig & { children: ReactNode }) {
  return (
    <ForgeW3DataProviders config={props}>
      <SkillForgeThemeAndDataProviders {...props}>{children}</SkillForgeThemeAndDataProviders>
    </ForgeW3DataProviders>
  )
}

export function SkillForgeConnectedDataProviders({
  children,
  ...props
}: SkillForgeWidgetConfig & { children: ReactNode }) {
  return (
    <ForgeW3ConnectedProviders config={props}>
      <SkillForgeThemeAndDataProviders {...props}>{children}</SkillForgeThemeAndDataProviders>
    </ForgeW3ConnectedProviders>
  )
}
