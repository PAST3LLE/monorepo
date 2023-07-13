import { ForgeStateProviders, ForgeW3Providers } from '@past3lle/forge-web3'
import { ThemeProviderSimple, useConstructTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'
import { DefaultTheme } from 'styled-components'

import { SkillForgeWidgetConfig } from '../../../types'
import { AppMessagesUpdater } from '../../AppMessages/updaters'
import { DappChainUpdater } from '../../Chain/updater'
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
      <DappChainUpdater />
      <ThemeProviderSimple theme={theme as DefaultTheme}>
        <AppMessagesUpdater />
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
    <ForgeStateProviders config={props}>
      <SkillForgeThemeAndDataProviders {...props}>{children}</SkillForgeThemeAndDataProviders>
    </ForgeStateProviders>
  )
}

export function SkillForgeConnectedDataProviders({
  children,
  ...props
}: SkillForgeWidgetConfig & { children: ReactNode }) {
  return (
    <ForgeW3Providers config={props}>
      <SkillForgeThemeAndDataProviders {...props}>{children}</SkillForgeThemeAndDataProviders>
    </ForgeW3Providers>
  )
}
