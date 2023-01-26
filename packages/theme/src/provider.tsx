import React, { Children, ReactElement, ReactNode, cloneElement, isValidElement, useMemo, useState } from 'react'
import { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider, css } from 'styled-components'

import {
  betweenMediaWidthTemplates as betweenMediaWidth,
  fromMediaWidthTemplates as fromMediaWidth,
  mediaHeightTemplates as mediaHeight,
  mediaWidthTemplates as mediaWidth
} from './styles/mediaQueries'
import { ThemeModes } from './types'
import { getThemeColours } from './utils'

const DEFAULT_THEME: Pick<
  DefaultTheme,
  'buttons' | 'shadow1' | 'whiteGradient1' | 'mediaHeight' | 'mediaWidth' | 'fromMediaWidth' | 'betweenMediaWidth'
> = {
  buttons: {
    font: {
      size: {
        small: '1rem',
        normal: '1.2rem',
        large: '1.6rem'
      }
    },
    borderRadius: '1rem',
    border: '0.1rem solid transparent'
  },
  // shadows
  shadow1: '#2F80ED',
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
  betweenMediaWidth
} as const

interface ThemeProviderProps {
  children?: ReactNode
  themeExtension?: Record<string, any>
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export const ThemeProvider = <T extends DefaultTheme>({ children, themeExtension = {} as T }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeModes>(ThemeModes.DARK)

  const themeObject = useMemo(() => {
    const themeColours = getThemeColours(mode)

    const computedTheme: DefaultTheme & typeof themeExtension = {
      // Compute the app colour pallette using the passed in colourTheme
      ...themeColours,
      // pass in defaults
      ...DEFAULT_THEME,
      // state
      autoDetect: true,
      mode,
      setMode,
      // unfold in any extensions
      // for example to make big/small buttons -> see src/components/Button ThemeWrappedButtonBase
      // to see it in action
      ...themeExtension
    }

    return computedTheme
  }, [mode, themeExtension])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {Children.map(children, (childElem) => {
        // make sure child is a valid react element as children by default can be type string|null|number
        const isValid = isValidElement(childElem) && childElem.type === 'function'
        return isValid
          ? cloneElement<DefaultTheme & typeof themeExtension>(childElem as ReactElement, { theme: themeObject })
          : childElem
      })}
    </StyledComponentsThemeProvider>
  )
}
