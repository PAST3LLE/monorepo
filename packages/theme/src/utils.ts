import { DDPXImageUrlMap, GenericImageSrcSet } from '@past3lle/types'
import { transparentize } from 'polished'
import { CSSObject, SimpleInterpolation, css } from 'styled-components'
import { hex } from 'wcag-contrast'

import { MEDIA_WIDTHS, MediaWidths } from './styles'
import { BaseColours } from './templates/base'
import { ThemeBaseRequired, ThemeModesRequired } from './types'

export const WHITE = BaseColours.white
export const OFF_WHITE = BaseColours.offwhite
export const BLACK = BaseColours.black
export const OFF_BLACK = BaseColours.offblack
export const BLACK_TRANSPARENT = transparentize(0.15, BLACK)

const whenMediaSmallerThan =
  (size: keyof ThemeBaseRequired['mediaWidth']) =>
  (first: CSSObject | TemplateStringsArray, ...interpolations: SimpleInterpolation[]) =>
  ({ theme }: { theme: ThemeBaseRequired }) =>
    theme.mediaWidth[size]`${css(first, ...interpolations)}`

export const upToExtraSmall = whenMediaSmallerThan('upToExtraSmall')
export const upToSmall = whenMediaSmallerThan('upToSmall')
export const upToMedium = whenMediaSmallerThan('upToMedium')
export const upToLarge = whenMediaSmallerThan('upToLarge')
export const upToExtraLarge = whenMediaSmallerThan('upToExtraLarge')

const whenMediaHeightSmallerThan =
  (size: keyof ThemeBaseRequired['mediaHeight']) =>
  (first: CSSObject | TemplateStringsArray, ...interpolations: SimpleInterpolation[]) =>
  ({ theme }: { theme: ThemeBaseRequired }) =>
    theme.mediaHeight[size]`${css(first, ...interpolations)}`

// height checks
export const upToExtraSmallHeight = whenMediaHeightSmallerThan('upToExtraSmallHeight')
export const upToSmallHeight = whenMediaHeightSmallerThan('upToSmallHeight')
export const upToMediumHeight = whenMediaHeightSmallerThan('upToMediumHeight')

const whenMediaLargerThan =
  (size: keyof ThemeBaseRequired['fromMediaWidth']) =>
  (first: CSSObject | TemplateStringsArray, ...interpolations: SimpleInterpolation[]) =>
  ({ theme }: { theme: ThemeBaseRequired }) =>
    theme.fromMediaWidth[size]`${css(first, ...interpolations)}`

export const fromExtraSmall = whenMediaLargerThan('fromExtraSmall')
export const fromSmall = whenMediaLargerThan('fromSmall')
export const fromMedium = whenMediaLargerThan('fromMedium')
export const fromLarge = whenMediaLargerThan('fromLarge')
export const fromExtraLarge = whenMediaLargerThan('fromExtraLarge')

const whenMediaBetween =
  (size: keyof ThemeBaseRequired['betweenMediaWidth']) =>
  (first: CSSObject | TemplateStringsArray, ...interpolations: SimpleInterpolation[]) =>
  ({ theme }: { theme: ThemeBaseRequired }) =>
    theme.betweenMediaWidth[size]`${css(first, ...interpolations)}`

export const betweenExtraSmallAndSmall = whenMediaBetween('betweenExtraSmallAndSmall')
export const betweenSmallAndMedium = whenMediaBetween('betweenSmallAndMedium')
export const betweenMediumAndLarge = whenMediaBetween('betweenMediumAndLarge')
export const betweenLargeAndExtraLarge = whenMediaBetween('betweenLargeAndExtraLarge')
export const betweenSmallAndLarge = whenMediaBetween('betweenSmallAndLarge')

// big to small
// e.g { width: 500, ar: "3:2" }
const IMG_SET_SIZE_ENTRIES = Object.entries(MEDIA_WIDTHS).reverse()
type UpToSizeKey = keyof typeof MEDIA_WIDTHS

type CheckHexColourContrastParams = { bgColour: string; fgColour: string }
export function checkHexColourContrast({ bgColour, fgColour }: CheckHexColourContrastParams) {
  const contrast = hex(bgColour, fgColour)

  return contrast
}

type BestContrastingColourParams = CheckHexColourContrastParams & {
  lightColour: string
  darkColour: string
}
const CONTRAST_THRESHOLD = 10
export function setBestContrastingColour({ bgColour, fgColour, lightColour, darkColour }: BestContrastingColourParams) {
  const contrastLevel = checkHexColourContrast({
    bgColour,
    fgColour
  })

  return contrastLevel < CONTRAST_THRESHOLD ? lightColour : darkColour
}
type LqIkUrlOptions = {
  fallbackUrl: string
  dpi?: keyof DDPXImageUrlMap
  transforms?: string | (((width?: number) => string) | string | null)[]
}
export function getLqIkUrl(
  urlAtWidth: DDPXImageUrlMap | undefined,
  { fallbackUrl, dpi = '2x', transform = '' }: Omit<LqIkUrlOptions, 'transforms'> & { transform?: string | null }
) {
  const queryUrl = urlAtWidth?.[dpi] || fallbackUrl
  const urlObj = queryUrl && new URL(queryUrl)

  if (!process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || !urlObj) return null

  return process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT + urlObj?.pathname + '?tr=' + transform
}
/**
 *
 * @param theme
 * @param options
 * @example {
    isLogo?: boolean | undefined;
    imageUrls?: (string | undefined)[] | undefined;
    backgroundColor?: string | undefined;
    backgroundAttributes: string[];
    backgroundBlendMode?: string | undefined;
} 
 * @returns
 */
type SetCssBackgroundParams = {
  imageUrls?: GenericImageSrcSet<MediaWidths>[]
  backgroundAttributes?: string[]
  backgroundBlendMode?: string
  backgroundColor?: string
  ignoreQueriesWithFixedWidth?: MediaWidths
  dpiLevel?: '3x' | '2x' | '1x'
  skipIk?: boolean
  lqIkUrlOptions?: Omit<LqIkUrlOptions, 'fallbackUrl'>
}
export const setCssBackground = (
  theme: ThemeBaseRequired,
  {
    imageUrls,
    backgroundColor = '',
    backgroundAttributes = ['center/cover no-repeat', 'center/cover no-repeat'],
    backgroundBlendMode = 'unset',
    ignoreQueriesWithFixedWidth = undefined,
    dpiLevel = '1x',
    skipIk = false,
    lqIkUrlOptions = {}
  }: SetCssBackgroundParams
) => {
  const getBackground = (width?: MediaWidths) => {
    return imageUrls
      ? imageUrls.map((urlSet, i, { length }) => {
          const [, isLast] = [!i, i === length - 1]

          const urlAtWidth = width && urlSet[width]
          const urlAtDpi = urlAtWidth?.[dpiLevel]

          const lqProp = lqIkUrlOptions.transforms?.[i]
          const lqTransform =
            typeof lqIkUrlOptions.transforms === 'string'
              ? lqIkUrlOptions.transforms
              : typeof lqProp === 'function'
              ? lqProp(width)
              : lqProp

          const lqUrl =
            !skipIk &&
            !!lqTransform &&
            getLqIkUrl(urlAtWidth, { fallbackUrl: urlSet.defaultUrl, transform: lqTransform, ...lqIkUrlOptions })

          const urlBuilt = `
            url(${lqUrl || urlAtDpi || urlSet.defaultUrl}) ${backgroundAttributes[i] || 'center/cover no-repeat'}${
            isLast ? ` ${backgroundColor}` : ','
          }
          `

          return urlBuilt
        })
      : backgroundColor
  }

  const backgroundMediaQueries = !!ignoreQueriesWithFixedWidth
    ? null
    : IMG_SET_SIZE_ENTRIES.map(([size, width]) => {
        const queryMethod = theme.mediaWidth?.[size as UpToSizeKey]
        if (!queryMethod) return null

        return queryMethod`background: ${getBackground(width)};`
      })

  return css`
    background: ${getBackground(ignoreQueriesWithFixedWidth)};
    ${backgroundMediaQueries}

    background-blend-mode: ${backgroundBlendMode};
  `
}

type BackgroundWithDPIProps = Partial<Omit<SetCssBackgroundParams, 'isLogo' | 'imageUrls'>> & {
  preset?: 'navbar' | 'header' | 'logo'
  modeColours?: [string, string]
}

export function setBestTextColour(bgColor: string) {
  return setBestContrastingColour({
    bgColour: bgColor,
    fgColour: OFF_WHITE,
    darkColour: BLACK,
    lightColour: OFF_WHITE
  })
}

export function setBackgroundWithDPI(
  theme: ThemeBaseRequired,
  logoUrlSet: GenericImageSrcSet<MediaWidths> | SetCssBackgroundParams['imageUrls'],
  auxOptions: BackgroundWithDPIProps = {}
) {
  const imageUrls = logoUrlSet && (Array.isArray(logoUrlSet) ? logoUrlSet : [logoUrlSet, logoUrlSet])
  const presetOptions = _getPresetOptions(auxOptions, theme.mode)
  const options = Object.assign({ imageUrls }, presetOptions, auxOptions)
  return css`
    ${setCssBackground(theme, options)}

    @media (min-resolution: 2x) {
      ${setCssBackground(theme, { ...options, dpiLevel: '2x' })}
    }

    @media (min-resolution: 3x) {
      ${setCssBackground(theme, { ...options, dpiLevel: '3x' })}}
    }
  `
}

function _getPresetOptions(
  options: BackgroundWithDPIProps,
  mode: ThemeModesRequired
): Partial<SetCssBackgroundParams> | undefined {
  const isLightMode = mode === 'LIGHT'
  switch (options.preset) {
    case 'header': {
      const [lmColour, dmColour] = options.modeColours || [OFF_WHITE, BLACK]
      return {
        backgroundColor: isLightMode ? lmColour : dmColour,
        backgroundAttributes: ['center / cover no-repeat', '5px / cover repeat'],
        backgroundBlendMode: 'difference',
        lqIkUrlOptions: { dpi: '3x', transforms: [null, 'pr-true,q-2,w-770,h-50'], ...options.lqIkUrlOptions }
      }
    }
    case 'navbar': {
      const [lmColour, dmColour] = options.modeColours || [BLACK, BLACK]
      return {
        backgroundColor: isLightMode ? lmColour : dmColour,
        backgroundAttributes: ['center / cover no-repeat', '5px / cover repeat'],
        backgroundBlendMode: 'difference',
        lqIkUrlOptions: { dpi: '3x', transforms: [null, 'pr-true,q-2,w-50,h-700'], ...options.lqIkUrlOptions }
      }
    }
    case 'logo':
      return {
        ...options,
        backgroundAttributes: ['center/cover repeat', 'center/cover repeat']
      }

    default: {
      const [lmColour, dmColour] = options.modeColours || [BLACK, BLACK]
      return {
        ...options,
        backgroundColor: isLightMode ? lmColour : dmColour
      }
    }
  }
}
