import { ThemeBaseRequired } from '@past3lle/theme'

import { Web3ModalConfigWeb3Props } from '../types'

/**
 * overwriteWeb3PropsWithOuterTheme
 * @description useful when using an external theme above your web3-modal.
 * @description Passes the external theme's "mode" to the inner web3-modal theme to trigger changes
 * @param props
 * @param externalTheme
 * @returns
 */
export function overwriteWeb3PropsWithOuterTheme<T extends ThemeBaseRequired>(
  props: Web3ModalConfigWeb3Props,
  externalTheme: T
): Web3ModalConfigWeb3Props {
  const constructedProps = Object.assign({}, props)
  if (!constructedProps.modals.root?.themeConfig) return props

  constructedProps.modals.root.themeConfig.mode = externalTheme.mode
  return constructedProps
}
