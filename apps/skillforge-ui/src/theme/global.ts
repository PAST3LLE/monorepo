import { ASSETS_MAP } from 'assets'
import { createGlobalStyle } from 'styled-components/macro'

export const GlobalStyles = createGlobalStyle`
    html, body {
        font-family: 'Roboto Flex', system-ui;

        > div#root {
            overflow-y: auto !important;
            background: url(${ASSETS_MAP.images.background.app}?tr=q-5,bl-8,pr-true) center/cover no-repeat;
        }
    }
`
