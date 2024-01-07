import { BasicUserTheme, CustomThemeOrTemplate, Subset, ThemeByModes, createCustomTheme } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import merge from 'lodash.merge'
import { useEffect, useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'

import { PstlSubModalsTheme } from '../../theme'

type ModalTheme =
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

export function useMergeThemes(customModalThemeByModes?: ThemeByModes<BasicUserTheme>) {
  const currentTheme = useTheme()

  const [theme, setTheme] = useState<ModalTheme>()
  // Serialise themes and compare in useEffect as deps
  const serialisedCustomModalTheme = JSON.stringify(customModalThemeByModes)
  const serialisedTheme = JSON.stringify(theme)
  useEffect(() => {
    if (!currentTheme?.modals?.base || !customModalThemeByModes?.modes?.DEFAULT?.modals?.base) {
      devWarn(
        '[@past3lle/web3-modal] Missing top-level theme; building new, simplified theme. Please check that you are properly passing a Past3lle ThemeProvider with a built theme via <createCustomModalThemeByModes> or others. See @past3lle/theme'
      )
    }
    const customThemeByMode = merge(
      {},
      customModalThemeByModes?.modes?.DEFAULT,
      customModalThemeByModes?.modes?.[currentTheme?.mode]
    )
    // Fill gaps in theme modes -> e.g DEFAULT into DARK/LIGHT
    const mergedCurrentMode = merge({}, currentTheme, customThemeByMode)
    // Fill gaps in sub modal themes -> e.g base theme into account/connection/network
    const mergedSubModals = Object.entries(mergedCurrentMode.modals || ({} as PstlSubModalsTheme)).reduce(
      (
        acc,
        [modalName, modalTheme]: [string | keyof PstlSubModalsTheme, PstlSubModalsTheme[keyof PstlSubModalsTheme]]
      ) => {
        if (modalName === 'base') acc[modalName] = modalTheme
        else {
          // Remove the unused base attributes
          // TODO: maybe better to split this into a shared object prop and pass only the shared
          const {
            padding: _p,
            title: _t,
            input: _i,
            error: _e,
            helpers: _h,
            closeIcon: _c,
            ...sharedTheme
          } = mergedCurrentMode.modals?.base || {}
          acc[modalName as keyof PstlSubModalsTheme] = merge({}, sharedTheme, modalTheme)
        }
        return acc
      },
      {} as PstlSubModalsTheme
    )

    mergedCurrentMode.modals = mergedSubModals

    const modifiedModalTheme = createCustomTheme({
      modes: { ...mergedCurrentMode.modes, [currentTheme?.mode || 'DEFAULT']: mergedCurrentMode }
    })

    setTheme(modifiedModalTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme?.mode, customModalThemeByModes?.modes, serialisedCustomModalTheme, serialisedTheme])

  return theme
}
