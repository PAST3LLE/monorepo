import { ForgeChainsMinimum, ForgeW3AppConfig } from '@past3lle/forge-web3'
import { ReactNode, useMemo } from 'react'

import { SkillForgeConnectedDataProviders, SkillForgeDisconnectedDataProviders } from '../state'
import { SkillForgeThemeByModes } from '../theme/types'
import { SkillForgeWidgetConfig } from '../types'

type Provider<chains extends ForgeChainsMinimum> = ({
  children,
  ...props
}: ForgeW3AppConfig<chains> & {
  theme: SkillForgeThemeByModes<chains>
  children: ReactNode
}) => JSX.Element

export function useConfigMiddleware<chains extends ForgeChainsMinimum>(
  config: SkillForgeWidgetConfig<chains>
): [Provider<chains>, SkillForgeWidgetConfig<chains>] {
  const Provider = useMemo(
    () => (config.web3.standalone ? SkillForgeDisconnectedDataProviders : SkillForgeConnectedDataProviders),
    [config.web3.standalone]
  )

  return [Provider, config]
}
