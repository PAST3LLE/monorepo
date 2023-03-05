import {  SkilltreeTheme, ThemeBaseRequired } from "@past3lle/theme"

declare module '*.svg' {
  export const src: string
  export default src
}

declare module '*.png' {
  export const src: string
  export default src
}

declare module '*.jpeg' {
  export const src: string
  export default src
}

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeBaseRequired, SkilltreeTheme {}
 }
 