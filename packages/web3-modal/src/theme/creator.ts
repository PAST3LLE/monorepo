import { Subset, createTemplateThemeFactory, ikUrlToSimpleImageSrcSet } from '@past3lle/theme'
import { MakeOptional } from '@past3lle/types'

import PstlModalTheme from './baseTheme'
import { PstlModalThemeExtension } from './types'

const FORGE_LOGO_URL = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-512-logo.png'
export const FORGE_LOGO_URL_MAP = ikUrlToSimpleImageSrcSet(FORGE_LOGO_URL)

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
