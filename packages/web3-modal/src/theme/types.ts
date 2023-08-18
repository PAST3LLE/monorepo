import { BackgroundPropertyFull, ThemeBaseRequired, ThemeContentPartsRequired } from '@past3lle/theme'
import { DeepRequired } from '@past3lle/types'

export interface FontStyles {
  color?: string
  family?: string
  style?: string
  size?: string
  weight?: number
  letterSpacing?: string
  lineHeight?: number
  textShadow?: string
  textTransform?: string
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
        position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
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
