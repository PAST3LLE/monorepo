import { createGlobalStyle } from 'styled-components/macro'

export const GlobalStyles = createGlobalStyle`
    html, body {
        font-family: 'Roboto Flex', system-ui;

        > div#root{
            overflow-y: auto !important;
        }
    }
` as unknown as () => JSX.Element // problems w/styled-component v5 and TS v5
