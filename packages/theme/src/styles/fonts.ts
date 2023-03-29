import { FONT_RobotoVariable } from '@past3lle/assets'
import { createGlobalStyle } from 'styled-components'

export const FontCssProvider = createGlobalStyle`
    font-family: system-ui;

    @supports (font-variation-settings: "wdth" 115) {
        @font-face {
            font-family: 'RobotoVariable';
            src: url(${FONT_RobotoVariable}) format('truetype');
            font-weight: 125 950;
            font-stretch: 75% 125%;
            font-style: oblique 0deg 20deg;
        }
    }
`
