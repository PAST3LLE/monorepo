import { Subset, createTemplateThemeFactory } from '@past3lle/theme'
import { MakeOptional } from '@past3lle/types'

import PstlModalTheme from './baseTheme'
import { PstlModalThemeExtension } from './types'

const templates = {
  PSTL_WEB3_MODAL: PstlModalTheme
} as const

const createThemeFactory = createTemplateThemeFactory(templates)

export const createTheme = (
  extension:
    | MakeOptional<
        Subset<
          { DEFAULT: PstlModalThemeExtension } & {
            LIGHT: Subset<PstlModalThemeExtension>
            DARK: Subset<PstlModalThemeExtension>
          }
        >,
        'LIGHT' | 'DARK'
      >
    | undefined
) => createThemeFactory('PSTL_WEB3_MODAL', extension)
