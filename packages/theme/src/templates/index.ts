import { BaseColours, BaseContent, BaseTheme } from './base'
import { Theme as PastelleThemeTemplate } from './pastelle'
import { Theme as SkillForgeThemeTemplate } from './skillforge'

const ThemeDefaultOptions = {
  BaseColours,
  BaseContent,
  BaseTheme
}

const ThemeTemplates = {
  PASTELLE: PastelleThemeTemplate,
  SKILLFORGE: SkillForgeThemeTemplate
} as const

export * from './types'

export { ThemeTemplates, ThemeDefaultOptions }
