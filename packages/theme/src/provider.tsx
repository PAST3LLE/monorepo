import React, {
  Children,
  FunctionComponent,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
  useState
} from 'react'
import { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider, css } from 'styled-components'

import {
  betweenMediaWidthTemplates as betweenMediaWidth,
  fromMediaWidthTemplates as fromMediaWidth,
  mediaHeightTemplates as mediaHeight,
  mediaWidthTemplates as mediaWidth
} from './styles/mediaQueries'
import { ThemeModes } from './types'
import { getThemeColours } from './utils'

type BaseThemeTypes = string | number | ((...args: any[]) => any)
type ThemeValueTypes = BaseThemeTypes | Record<string, BaseThemeTypes>

type KeyOmit<T, U extends keyof DefaultTheme> = T & { [P in U]?: never }
type OverrideableTheme = Partial<DefaultTheme> &
  KeyOmit<
    { [key: string]: ThemeValueTypes },
    | 'mode'
    | 'autoDetect'
    | 'setMode'
    | 'setAutoDetect'
    | 'mediaHeight'
    | 'mediaWidth'
    | 'betweenMediaWidth'
    | 'fromMediaWidth'
  >

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
}

interface ThemeProviderProps {
  children?: ReactNode
  themeExtension?: OverrideableTheme
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export const ThemeProvider = ({ children, themeExtension = {} }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeModes>(ThemeModes.DARK)
  const [autoDetect, setAutoDetect] = useState<boolean>(true)

  const themeObject = useMemo(() => {
    const THEME_COLOURS = getThemeColours(mode)

    const computedTheme = {
      // Compute the app colour pallette using the passed in colourTheme
      ...THEME_COLOURS,
      // pass in defaults
      ...DEFAULT_THEME,
      // unfold in any extensions
      // for example to make big/small buttons -> see src/components/Button ThemeWrappedButtonBase
      // to see it in action
      ...themeExtension,
      // state
      mode,
      autoDetect,
      setMode,
      setAutoDetect
    }

    return computedTheme
  }, [autoDetect, mode, themeExtension])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {Children.map(children, (childElem) => {
        // make sure child is a valid react element as children by default can be type string|null|number
        const isValid = isValidElement(childElem) && childElem.type === 'function'
        return isValid
          ? cloneElement<{ theme: typeof themeObject }>(
              childElem as ReactElement<any, FunctionComponent<{ theme: typeof themeObject }>>,
              {
                theme: themeObject
              }
            )
          : childElem
      })}
    </StyledComponentsThemeProvider>
  )
}
