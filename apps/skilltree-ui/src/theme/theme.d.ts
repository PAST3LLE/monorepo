import { CustomTheme as LocalCustomTheme } from './customTheme'
import { CustomTheme } from '@past3lle/theme'

declare module 'styled-components' {
  // @ts-ignore - recursive error
  export interface DefaultTheme extends LocalCustomTheme, CustomTheme {}
}
