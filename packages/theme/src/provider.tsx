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
  defaultMode?: K
  defaultAutoDetect?: boolean
  theme: T
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export function ThemeProviderSimple({ theme, children }: { theme: DefaultTheme; children: ReactNode }) {
  return (
    <StyledComponentsThemeProvider theme={theme}>
      {Children.map(children, (childElem) => {
        // make sure child is a valid react element as children by default can be type string|null|number
        const isValid = isValidElement(childElem) && childElem.type === 'function'
        return isValid
          ? cloneElement<{ theme: typeof theme }>(
              childElem as ReactElement<any, FunctionComponent<{ theme: typeof theme }>>,
              {
                theme
              }
            )
          : childElem
      })}
    </StyledComponentsThemeProvider>
  )
}

export function useConstructTheme<
  T extends CustomThemeOrTemplate<ThemeByModes, AvailableThemeTemplate>,
  K extends ThemeModesRequired
>({
  mode: modeCustom,
  setMode: setModeCustom,
  defaultAutoDetect = true,
  defaultMode,
  theme
}: ThemeProviderProps<T, K>) {
  const [innerMode, setInnerMode] = useState<keyof typeof theme.modes>(defaultMode || 'DEFAULT')
  const [mode, setMode] = [(modeCustom || innerMode) as ThemeModesRequired | 'DEFAULT', setModeCustom || setInnerMode]

  const [autoDetect, setAutoDetect] = useState<boolean>(defaultAutoDetect)

  const staticTheme = useMemo(() => {
    const {
      modes: { DEFAULT: DEFAULT_THEME = {} },
      baseColours: BASE_COLOURS,
      baseContent: {
        modes: { DEFAULT: DEFAULT_CONTENT = {} }
      },
      ...REST_THEME
    } = theme

    return {
      ...REST_THEME,
      ...BASE_COLOURS,
      ...DEFAULT_CONTENT,
      ...DEFAULT_THEME
    } as const
  }, [])

  const dynamicTheme = useMemo(() => {
    const {
      modes: { [mode]: CURRENT_THEME = {} },
      baseContent: {
        modes: { [mode]: CURRENT_CONTENT = {} }
      }
    } = theme

    const computedTheme = {
      ...CURRENT_CONTENT,
      ...CURRENT_THEME,
      // state
      mode,
      autoDetect,
      setMode,
      setAutoDetect
    } as const

    return computedTheme
  }, [autoDetect, mode, modeCustom, theme])

  return { ...staticTheme, ...dynamicTheme }
}

export function ThemeProvider<
  T extends CustomThemeOrTemplate<ThemeByModes, AvailableThemeTemplate>,
  K extends ThemeModesRequired
>(props: ThemeProviderProps<T, K> & { children: ReactNode }) {
  const themeObject = useConstructTheme(props)

  return (
    <StyledComponentsThemeProvider theme={themeObject as DefaultTheme}>
      {Children.map(props.children, (childElem) => {
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
