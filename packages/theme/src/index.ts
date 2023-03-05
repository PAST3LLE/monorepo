import { createCustomTheme, createTemplateTheme } from './creator'
import { DefaultOptions as ThemeDefaultOptions, ThemeTemplates } from './templates'
import * as ThemeTemplateTypes from './templates/types'

export * from './provider'
export * from './styles'
export * from './utils'
export * from './types'

export * from './templates'

export { ThemeTemplates, ThemeTemplateTypes, ThemeDefaultOptions, createCustomTheme, createTemplateTheme }
