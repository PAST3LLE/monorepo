import { SkilltreeTheme, ThemeBaseRequired } from '@past3lle/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeBaseRequired, SkilltreeTheme {}
}
