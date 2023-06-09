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
    if (!currentTheme?.modals?.connection || !customModalThemeByModes?.modes?.DEFAULT?.modals?.connection) {
      devWarn(
        '[Past3lle-Web3-Modal] Missing top-level theme; building new, simplified theme. Please check that you are properly passing a Past3lle ThemeProvider with a built theme via <createCustomModalThemeByModes> or others. See @past3lle/theme'
      )
    }
    const customThemeByMode = customModalThemeByModes?.modes?.[currentTheme?.mode || 'DEFAULT']
    const mergedCurrentMode = merge({}, currentTheme, customThemeByMode)

    const modifiedModalTheme = createCustomTheme({
      modes: { ...mergedCurrentMode.modes, [currentTheme?.mode || 'DEFAULT']: mergedCurrentMode }
    })

    setTheme(modifiedModalTheme)
  }, [customModalThemeByModes, currentTheme])

  return theme
}
