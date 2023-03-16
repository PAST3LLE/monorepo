import {
  FontCssProvider, // setBackgroundWithDPI,
  StaticGlobalCssProvider // urlToSimpleGenericImageSrcSet
} from '@past3lle/theme'
import React from 'react'
import { createGlobalStyle } from 'styled-components/macro'

const CustomGlobalStyles = createGlobalStyle`
    body {
        overflow: hidden;
        background-color: ${({ theme }) => theme.offblack};
        color: ${({ theme }) => theme.offwhite};
        
        > div#root {
          height: 100vh;
            > header, nav {
                background-color: #3c114f66;
            }
            > header, article {
              justify-content: center;
            }
            > header {
              padding: 1rem 2rem;
            }
        }
    }

`

export const GlobalCssProviders = () => (
  <>
    <FontCssProvider />
    <StaticGlobalCssProvider />
    <CustomGlobalStyles />
  </>
)
