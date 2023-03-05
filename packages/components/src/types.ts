import { PastelleTheme, ThemeBaseRequired } from '@past3lle/theme'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeBaseRequired, PastelleTheme {}
}
