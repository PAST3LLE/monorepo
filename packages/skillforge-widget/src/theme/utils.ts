import { type ChainsPartialReadonly, type SupportedForgeChains } from '@past3lle/forge-web3'
import { type Subset, createPast3lleTemplateTheme } from '@past3lle/theme'
import { useTheme } from 'styled-components'

import { SkillForgeThemeByModes } from './types'

export function useAssetsMap() {
  return useTheme().assetsMap
}
type ThemeSubType = SkillForgeThemeByModes<ChainsPartialReadonly<SupportedForgeChains>>['modes']
/**
 * @name createTheme
 * @param extension - optional extension to the theme
 * @returns a theme object for use with the SkillForge component
 */
export const createTheme = <E extends Subset<ThemeSubType>>(extension?: E) =>
  createPast3lleTemplateTheme('SKILLFORGE', extension)
