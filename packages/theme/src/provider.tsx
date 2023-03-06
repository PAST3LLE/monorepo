import React, {
  Children,
  Dispatch,
  FunctionComponent,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  isValidElement,
  useMemo,
  useState
} from 'react'
import { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { AvailableThemeTemplate, CustomThemeOrTemplate, ThemeByModes } from './types'
import { ThemeModesRequired } from './types'

interface ThemeProviderProps<T, K> {
  children?: ReactNode
  mode?: K
  setMode?: Dispatch<SetStateAction<ThemeModesRequired>>
  defaultAutoDetect?: boolean
  theme: T
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export function ThemeProvider<
  T extends CustomThemeOrTemplate<ThemeByModes, AvailableThemeTemplate>,
  K extends ThemeModesRequired
>({ children, mode: modeCustom, setMode: setModeCustom, defaultAutoDetect = true, theme }: ThemeProviderProps<T, K>) {
  const [innerMode, setInnerMode] = useState<keyof typeof theme.modes>(
    (modeCustom || 'DEFAULT') as ThemeModesRequired | 'DEFAULT' | (() => ThemeModesRequired | 'DEFAULT')
  )

  const [mode, setMode] = [(modeCustom || innerMode) as ThemeModesRequired | 'DEFAULT', setModeCustom || setInnerMode]

  const [autoDetect, setAutoDetect] = useState<boolean>(defaultAutoDetect)

  const themeObject = useMemo(() => {
    const {
      modes: { DEFAULT: DEFAULT_THEME, [mode]: CURRENT_THEME },
      baseColours: BASE_COLOURS,
      baseContent: {
        modes: { DEFAULT: DEFAULT_CONTENT, [mode]: CURRENT_CONTENT }
      },
      ...REST_THEME
    } = theme
    const computedTheme = {
      ...REST_THEME,
      ...BASE_COLOURS,
      ...DEFAULT_CONTENT,
      ...CURRENT_CONTENT,
      ...DEFAULT_THEME,
      ...CURRENT_THEME,
      // state
      mode,
      autoDetect,
      setMode,
      setAutoDetect
    } as DefaultTheme

    return computedTheme
  }, [autoDetect, mode])

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
