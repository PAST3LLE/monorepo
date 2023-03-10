import { SkillForgeTheme, ThemeBaseRequired } from '@past3lle/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeBaseRequired, SkillForgeTheme {}
}
