import { BackgroundPropertyFull, ThemeBaseRequired, ThemeContentPartsRequired } from '@past3lle/theme'
import { DeepRequired } from '@past3lle/types'

type DefaultCSSProps = string | 'initial' | 'none' | 'unset' | 'inherit'

export interface FontStyles {
  color?: DefaultCSSProps
  family?: DefaultCSSProps
  style?: DefaultCSSProps
  size?: DefaultCSSProps
  weight?: number
  letterSpacing?: DefaultCSSProps
  lineHeight?: number
  textShadow?: DefaultCSSProps
  textTransform?: DefaultCSSProps
  textAlign?: 'left' | 'right' | 'center' | DefaultCSSProps
}
interface BorderStyles {
  border?: string
  color?: string
  radius?: string
}
interface BackgroundStyles {
  background?: string
  backgroundImg?: BackgroundPropertyFull
}

interface AccountModalButtons {
  font?: FontStyles
  background?: {
    background?: string
    backgroundImg?: BackgroundPropertyFull
  }
  border?: BorderStyles
}

export type PstlModalThemeExtension = Partial<ThemeContentPartsRequired> & DeepRequired<PstlModalTheme>
export interface PstlModalTheme {
  modals?: {
    base?: {
      filter?: string
      baseFontSize?: number
      font?: FontStyles
      title?: {
        font?: FontStyles
      }
      error?: {
        font?: Pick<FontStyles, 'color'>
        background?: Pick<BackgroundStyles, 'background'>
      }
      helpers?: {
        show?: boolean
        font?: Pick<FontStyles, 'color' | 'size'>
      }
      closeIcon?: {
        color?: string
        /**
         * Size of icon in pixels
         * @type number
         */
        size?: number
        background?: Omit<BackgroundStyles, 'backgroundImg'>
      }
      background?: BackgroundStyles
      padding?: string
    }
    connection?: {
      filter?: string
      baseFontSize?: number
      button?: {
        font?: FontStyles
        background?: BackgroundStyles & {
          connected?: string
        }
        height?: string
        icons?: {
          filter?: string
          height?: string
        }
        border?: BorderStyles
        hoverAnimations?: boolean
      }
    }
    account?: {
      filter?: string
      baseFontSize?: number
      container: {
        addressAndBalance: {
          background?: BackgroundStyles & { unsupported?: string }
          border?: BorderStyles
        }
        walletAndNetwork: {
          background?: BackgroundStyles
          border?: BorderStyles
        }
      }
      connectionImages?: {
        size?: string
        background?: {
          background?: string
        }
      }
      icons?: {
        wallet?: { url: string; invert?: boolean }
        network?: { url: string; invert?: boolean }
        copy?: { url: string; invert?: boolean }
      }
      button?: {
        disconnect?: AccountModalButtons
        switchNetwork?: AccountModalButtons
        explorer?: AccountModalButtons
        copy?: AccountModalButtons
      }
      text?: {
        main?: {
          font?: FontStyles
        }
        balance?: {
          font?: FontStyles
        }
        address?: {
          font?: FontStyles
        }
      }
    }
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends PstlModalTheme, ThemeBaseRequired {}
}
