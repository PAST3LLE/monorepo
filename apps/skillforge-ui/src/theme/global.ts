import { createGlobalStyle } from 'styled-components/macro'

export const GlobalStyles = createGlobalStyle`
    html, body {
        font-family: 'Roboto Flex', system-ui;

        > div#root{
            overflow-y: auto !important;
        }
    }
`
