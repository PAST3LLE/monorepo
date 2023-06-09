import { MakeOptional } from '@past3lle/types'
import merge from 'lodash.merge'

import {
  betweenMediaWidthTemplates as betweenMediaWidth,
  fromMediaWidthTemplates as fromMediaWidth,
  mediaHeightTemplates as mediaHeight,
  mediaWidthTemplates as mediaWidth
} from './styles/mediaQueries'
import { ThemeTemplates } from './templates'
import { BaseTheme } from './templates/base'
import {
  AvailableThemeTemplate,
  BasicUserTheme,
  CustomThemeOrTemplate,
  Subset,
  ThemeByModes,
  ThemeMinimumRequired
} from './types'

interface CreateTheme<T, K, M extends BasicUserTheme = BasicUserTheme> {
  new (
    args: T extends ThemeByModes<M> ? T : K extends AvailableThemeTemplate ? never : ThemeMinimumRequired
  ): CustomThemeOrTemplate<T, K, M>
}

/**
 * CreateTheme constructor function
 * Function REQUIRES at _least_ a theme Interface OR a template name as defined by the @type {ThemeTemplateKey}
 * @example
 * const SkillForgeTheme = CreateTheme<void, "SKILLFORGE">()
 * const skilltreeTheme = new SkillForgeTheme()
 * skilltreeTheme.saltySwamys // <-- exists
 * @returns Constructed theme object consisting of the required parts + optionals
 */
function CreateTheme<T = undefined, K = undefined, M extends BasicUserTheme = BasicUserTheme>(): CreateTheme<T, K, M> {
  return class {
    /*
     * MEDIA QUERIES
     */
    mediaWidth = mediaWidth
    mediaHeight = mediaHeight
    fromMediaWidth = fromMediaWidth
    betweenMediaWidth = betweenMediaWidth

    constructor(args: T extends ThemeByModes<M> ? T : K extends AvailableThemeTemplate ? never : ThemeMinimumRequired) {
      Object.assign(this, args)
    }
  } as CreateTheme<T, K, M>
}

/**
 * createCustomTheme - create a "DefaultTheme" type + realdata object (TM) and pass to the creator fn
 * @example
  export const CUSTOM_THEME = {
    modes: {
      DEFAULT: {
        socks: {
          size: '200rem',
          colour: 'red',
          importanceColour: 'carrot'
        },
        cartoons: {
          watchedColor: '#1234',
          soldColor: 'rgba(0,2,5,0.24)'
        }
      },
      DARK: {
        // ... theme
      },
      // ... rest theme mdoes
    }
    
  } as const

  type CustomTheme = typeof CUSTOM_THEME.modes.DEFAULT
  declare module 'styled-components' {
    export interface DefaultTheme extends ThemeBaseRequired, CustomTheme {}
  }

  const customTheme = createCustomTheme<DefaultTheme>(CUSTOM_THEME)

  customTheme.cartoons.soldColor // <-- rgba(0,2,5,0.24)
  customTheme.mediaWidth.upToExtraLarge // <-- mediaWidth fn
*/
export function createCustomTheme<T extends ThemeByModes, M extends BasicUserTheme = BasicUserTheme>(
  theme: T
): CustomThemeOrTemplate<T, undefined, M> {
  const CustomThemeCreator = CreateTheme<T, undefined, M>()
  const auxTheme = {
    ...BaseTheme,
    ...theme
  } as T extends ThemeByModes<M> ? ThemeMinimumRequired & T : ThemeMinimumRequired

  return new CustomThemeCreator(auxTheme)
}

/**
 * createTemplateThemeFactory
 * @description Accepts a "themeTemplates" object which contains key/value pairs of theme names to themes
 * @example
  const appThemeCreators = createTemplateThemeFactory({
    SALTY_BOI: {
      modes: {
        DEFAULT: {
          saltinessColour: 'pink',
          ...themeStuff
        },
        DARK: {
          ...darkThemeStuff
        },
        LIGHT: {}
      }
    }
  })

  const saltyTheme = appThemeCreators("SALTY_BOI")
  saltyTheme.modes.DEFAULT.saltinessColour // string
 * @param templates 
 * @returns 
 */
export const createTemplateThemeFactory = <TE extends { [name: string]: ThemeByModes }>(templates: TE) =>
  function createTemplateTheme<K extends keyof TE, E extends MakeOptional<Subset<TE[K]['modes']>, 'DARK' | 'LIGHT'>>(
    template: K,
    extension?: E
  ) {
    const theme = templates[template]

    // if extension passed, deep merge
    // and set type accordingly
    if (extension) {
      // Merge together all parts
      const mergedThemeModes = merge({}, theme.modes, extension)
      theme.modes = mergedThemeModes
    }

    return createCustomTheme(
      theme as TE[K] & {
        modes:
          | ({
              DEFAULT: BasicUserTheme
            } & {
              LIGHT: Subset<BasicUserTheme>
              DARK: Subset<BasicUserTheme>
            } & E)
          | undefined
      }
    )
  }

// Export pre-created PASTELLE (shop-ui) and SKILLFORGE (skilltree-ui) themes as syntactic sugar
export const createPast3lleTemplateTheme = createTemplateThemeFactory(ThemeTemplates)
