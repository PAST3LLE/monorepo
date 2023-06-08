import { ThemeByModes, createCustomTheme, ikUrlToSimpleImageSrcSet } from '@past3lle/theme'

import { PstlModalTheme } from './types'

const FORGE_LOGO_URL = 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-512-logo.png'
export const FORGE_LOGO_URL_MAP = ikUrlToSimpleImageSrcSet(FORGE_LOGO_URL)

export const createTheme = ({
  LIGHT,
  DARK,
  ...REST
}: Partial<ThemeByModes<PstlModalTheme>['modes']> & Pick<ThemeByModes<PstlModalTheme>['modes'], 'DEFAULT'>) => {
  const theme = {
    modes: {
      DEFAULT: REST.DEFAULT,
      LIGHT: LIGHT || REST.DEFAULT,
      DARK: DARK || REST.DEFAULT
    }
  }

  return createCustomTheme(theme)
}
