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
import { DefaultTheme, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { AvailableThemeTemplate, CustomThemeOrTemplate, ThemeByModes, ThemeMinimumRequired } from './types'
import { ThemeModesRequired } from './types'

interface ThemeProviderProps<T, K> {
  children?: ReactNode
  defaultMode?: K
  defaultAutoDetect?: boolean
  theme: T
}

// Extension/override of styled-components' ThemeProvider but with our own constructed theme object
export function ThemeProvider<T extends CustomThemeOrTemplate<ThemeByModes, AvailableThemeTemplate>, K>({
  children,
  defaultMode,
  defaultAutoDetect = true,
  theme
}: ThemeProviderProps<T, K>) {
  const [mode, setMode] = useState<keyof typeof theme.modes>(
    (defaultMode || 'DEFAULT') as ThemeModesRequired | 'DEFAULT' | (() => ThemeModesRequired | 'DEFAULT')
  )
  const [autoDetect, setAutoDetect] = useState<boolean>(defaultAutoDetect)

  const themeObject = useMemo(() => {
    const {
      modes: { DEFAULT: DEFAULT_THEME, [mode]: CURRENT_THEME },
      ...BASE_THEME
    } = theme
    const computedTheme = {
      ...(BASE_THEME as ThemeMinimumRequired),
      ...DEFAULT_THEME,
      // Compute the app colour pallette using the passed in colourTheme
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
