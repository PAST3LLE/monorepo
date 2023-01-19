import React, { useMemo, Children, isValidElement, cloneElement, ReactNode, useState } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css, DefaultTheme } from 'styled-components'

import { getThemeColours } from './utils'
import {
  mediaHeightTemplates as mediaHeight,
  mediaWidthTemplates as mediaWidth,
  fromMediaWidthTemplates as fromMediaWidth,
  betweenMediaWidthTemplates as betweenMediaWidth,
} from './styles/mediaQueries'
import { ThemeModes } from './styled'

const DEFAULT_THEME: Partial<DefaultTheme> = {
  buttons: {
    font: {
      size: {
        small: '1rem',
        normal: '1.2rem',
        large: '1.6rem',
      },
    },
    borderRadius: '1rem',
    border: '0.1rem solid transparent',
  },
  // gradients
  whiteGradient1: css`
    background-image: linear-gradient(to top, ghostwhite, #fff 53%);
  `,
  // media queries
  // height
  mediaHeight,
  // width
  mediaWidth,
  // from size queries
  fromMediaWidth,
  // between size queries
  betweenMediaWidth,
  // css snippets
  // can be used in components
  // like: ${({ theme }) => theme.flexColumnNoWrap}
  flexColumnNoWrap: css`
    display: flex;
    flex-flow: column nowrap;
  `,
  flexRowNoWrap: css`
    display: flex;
    flex-flow: row nowrap;
  `,
}

interface ThemeProviderProps {
  children?: ReactNode
  themeExtension: Record<any, any>
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export const ThemeProvider = ({ children, themeExtension = {} }: ThemeProviderProps) => {
  const [mode, setThemeMode] = useState<ThemeModes>(ThemeModes.DARK)

  const themeObject = useMemo(() => {
    const themeColours = getThemeColours(mode)

    const computedTheme: DefaultTheme = {
      // Compute the app colour pallette using the passed in colourTheme
      ...themeColours,
      // pass in defaults
      ...DEFAULT_THEME,
      mode,
      //shadows
      shadow1: '#2F80ED',
      // unfold in any extensions
      // for example to make big/small buttons -> see src/components/Button ThemeWrappedButtonBase
      // to see it in action
      ...(themeExtension as any),
    }

    return computedTheme
  }, [mode, themeExtension])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {Children.map(
        children,
        (childWithTheme) =>
          // make sure child is a valid react element as children by default can be type string|null|number
          // @ts-ignore
          isValidElement(childWithTheme) && cloneElement(childWithTheme, { theme: themeObject, setThemeMode })
      )}
    </StyledComponentsThemeProvider>
  )
}
