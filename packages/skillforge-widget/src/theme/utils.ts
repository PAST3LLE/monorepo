import { ChainsPartialReadonly } from '@past3lle/skillforge-web3'
import { Subset, ThemeByModes, createPast3lleTemplateTheme } from '@past3lle/theme'
import { useTheme } from 'styled-components'

import { SkillForgeTheme } from './types'

export function useAssetsMap() {
  return useTheme().assetsMap
}

/**
 * @name createTheme
 * @param extension - optional extension to the theme
 * @returns a theme object for use with the SkillForge component
 */
export const createTheme = <E extends Subset<ThemeByModes<SkillForgeTheme<ChainsPartialReadonly>>['modes']>>(
  extension?: E
) => createPast3lleTemplateTheme('SKILLFORGE', extension)
