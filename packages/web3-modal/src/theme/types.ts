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
    }
    connection?: {
      filter?: string
      baseFontSize?: number
      helpers?: {
        show?: boolean
        color?: string
      }
      closeIcon?: {
        color?: string
        size?: string
      }
      background?: BackgroundStyles
      padding?: string
      button?: {
        font?: FontStyles
        background?: BackgroundStyles & {
          connected?: string
        }
        icons?: {
          filter?: string
          height?: string
          maxHeight?: string
        }
        border?: {
          border?: string
          color?: string
          radius?: string
        }
        hoverAnimations?: boolean
      }
    }
    account?: {
      filter?: string
      baseFontSize?: number
      balanceAndAddressContainer?: {
        background?: BackgroundStyles & { unsupported?: string }
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
