import { ButtonProps, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeModesRequired } from '@past3lle/theme'
import { ReactNode } from 'react'

import { WithChainIdFromUrl } from '../../../providers/types'
import { LoadingScreenProps } from '../../LoadingScreen'

/**
 * @name ThemeConfigProps
 * @description PSTL modal theme configuration
 * @property theme - see {@link ThemeByModes}
 * @property mode - see {@link ThemeModesRequired}
 */
export interface ThemeConfigProps<
  T extends ThemeByModes<BasicUserTheme> = ThemeByModes<BasicUserTheme>,
  K extends ThemeModesRequired = ThemeModesRequired
> {
  theme: T
  mode?: K
}

export type BaseModalProps = Omit<ModalProps, 'isLargeImageModal'> &
  WithChainIdFromUrl & {
    title?: string
    /**
     * @name themeConfig
     * @description Optional. PSTL modal theme configuration. See {@link ThemeConfigProps}. 
     * @tip ThemeConfig.mode can be used to sync and external theme mode with modal theme mode.
     * 
     * @example
     interface ThemeConfigProps<
        T extends ThemeByModes<BasicUserTheme> = ThemeByModes<BasicUserTheme>,
        K extends ThemeModesRequired = ThemeModesRequired
        > {
        theme: T
        mode?: K
        }
    */
    themeConfig?: ThemeConfigProps
    /**
     * @name loaderProps
     * @description Optional. Async loader props. For when connector modals are loading.
     */
    loaderProps?: LoadingScreenProps
    /**
     * @name buttonProps
     * @description Optional. Modal connector button style props
     *
     * See {@link ButtonProps}
     */
    buttonProps?: ButtonProps
    /**
     * @name zIndex
     * @description Optional. Set root modal z-index. Should be lower than any other modal z-index but greater than underlying app z-indices
     */
    zIndex?: number
    /**
     * @name errorOptions
     * @description Error options.
     */
    errorOptions?: {
      error: Error | null
      show?: boolean
    }
    /**
     * @name openType
     * @description Modal account type. 'root' uses the built in, extensible root modal; 'walletconnect' uses WalletConnect's
     * @default root
     */
    openType?: 'root' | 'walletconnect'
    children?: ReactNode
  }
