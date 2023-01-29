import { CustomTheme } from "@past3lle/theme"
import { CustomTheme as LocalCustomTheme } from "./customTheme"

declare module 'styled-components' {
    // @ts-ignore - recursive error
    export interface DefaultTheme extends LocalCustomTheme, CustomTheme {}
}