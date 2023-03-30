import { DIMENSIONS_MAP } from './dimensions'
import { Button } from '@past3lle/components'
import {
  RobotoVariableFontProvider,
  setBackgroundWithDPI,
  StaticGlobalCssProvider,
  upToSmall,
  urlToSimpleGenericImageSrcSet
} from '@past3lle/theme'
import React from 'react'
import { createGlobalStyle } from 'styled-components/macro'

const CustomGlobalStyles = createGlobalStyle`
    body {
        overflow: revert;
        background-color: ${({ theme }) => theme.offblack};
        color: ${({ theme }) => theme.offwhite};

        ${({ theme }) =>
          setBackgroundWithDPI(
            theme,
            urlToSimpleGenericImageSrcSet(
              'https://cdn.shopify.com/s/files/1/0567/9389/0867/products/ascendance-stairs-2_bd74580f-639a-4688-8398-fbb300c18d01.png?v=1678717686'
            )
          )}
    }

    body > div#root {
      overflow: revert !important;
      height: 100vh;

      > header, nav {
        background-color: #3c114f66;
      }
      > header, article {
        justify-content: center;
      }
      > header {
        height: ${DIMENSIONS_MAP.header.height};
        padding: 1rem 2rem;
      }
      > article {
        overflow: revert;
      }

      a {
        text-decoration: none;
        color: cyan;
      }

      ${Button} {
        font-size: 3rem;
        font-weight: 300;

        ${upToSmall`
          font-size: 2rem;
        `}
      }
    }

`

export const GlobalCssProviders = () => (
  <>
    <RobotoVariableFontProvider />
    <StaticGlobalCssProvider />
    <CustomGlobalStyles />
  </>
)
