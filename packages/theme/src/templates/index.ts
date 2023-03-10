import { BaseColours, BaseContent, BaseTheme } from './base'
import { Theme as PastelleThemeTemplate } from './pastelle'
import { Theme as SkillForgeThemeTemplate } from './skilltree'

const ThemeDefaultOptions = {
  BaseColours,
  BaseContent,
  BaseTheme
}

const ThemeTemplates = {
  PASTELLE: PastelleThemeTemplate,
  SKILLTREE: SkillForgeThemeTemplate
} as const

export * from './types'

export { ThemeTemplates, ThemeDefaultOptions }
