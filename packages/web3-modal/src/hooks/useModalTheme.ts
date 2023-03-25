import { BasicUserTheme, CustomThemeOrTemplate, Subset, ThemeByModes, createCustomTheme } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import merge from 'lodash.merge'
import { useEffect, useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'

export function useModalTheme(customModalThemeByModes?: ThemeByModes<BasicUserTheme>) {
  const currentTheme = useTheme()
  const [theme, setTheme] = useState<
    | CustomThemeOrTemplate<
        {
          modes: {
            [x: string]: BasicUserTheme
            LIGHT: BasicUserTheme
            DARK: BasicUserTheme
            DEFAULT: DefaultTheme & Subset<BasicUserTheme>
          }
        },
        undefined,
        BasicUserTheme
      >
    | undefined
  >()

  useEffect(() => {
    if (
      !currentTheme?.content?.modals?.connection ||
      !customModalThemeByModes?.modes.DEFAULT?.content?.modals?.connection
    ) {
      devWarn(
        '[Past3lle-Web3-Modal] Missing top-level theme; building new, simplified theme. Please check that you are properly passing a Past3lle ThemeProvider with a built theme via <createCustomModalThemeByModes> or others. See @past3lle/theme'
      )
    }
    const mergedCurrentMode = merge({}, currentTheme, customModalThemeByModes?.modes[currentTheme?.mode || 'DEFAULT'])
    const simpleModalTheme = createCustomTheme({
      modes: { LIGHT: {}, DARK: {}, DEFAULT: mergedCurrentMode, [currentTheme?.mode]: mergedCurrentMode }
    })

    setTheme(simpleModalTheme)
  }, [customModalThemeByModes, currentTheme])

  return theme
}
