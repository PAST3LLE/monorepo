import { ThemeBaseRequired } from '../types'
import { PastelleThemeExtension } from './pastelle'
import { SkilltreeThemeExtension } from './skilltree'

export type PastelleTheme = PastelleThemeExtension & ThemeBaseRequired
export type SkilltreeTheme = SkilltreeThemeExtension & ThemeBaseRequired
