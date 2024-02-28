import { SUPPORTED_CHAINS_PROD } from './chains'
import { Web3ModalConfigWeb3Props } from '@past3lle/forge-web3'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'

export const W3M_THEME_VARIABLES = {
  '--wcm-color-bg-1': SKILLFORGE_THEME.blackOpaque,
  '--w3m-accent': '#525291',
  '--wcm-color-bg-2': SKILLFORGE_THEME.modes.DEFAULT.mainBgAlt,
  // TODO: either host image on IK and call using params to set height/width
  // TODO: OR just save a formatted image W x H somewhere here
  '--wcm-color-bg-3': SKILLFORGE_THEME.blackOpaque,
  '--wcm-color-fg-1': SKILLFORGE_THEME.offwhiteOpaqueMore
  // '--wcm-background-image-url': 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png?tr=h-103,w-0.99',
}

export const WCM_THEME_VARIABLES: Web3ModalConfigWeb3Props<
  typeof SUPPORTED_CHAINS_PROD
>['modals']['walletConnect']['themeVariables'] = {
  '--wcm-background-color': SKILLFORGE_THEME.blackOpaque,
  '--wcm-accent-color': '#525291',
  '--wcm-accent-fill-color': SKILLFORGE_THEME.modes.DEFAULT.mainBgAlt,
  // TODO: either host image on IK and call using params to set height/width
  // TODO: OR just save a formatted image W x H somewhere here
  '--wcm-overlay-background-color': SKILLFORGE_THEME.blackOpaque
  // '--wcm-background-image-url': 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png?tr=h-103,w-0.99',
  // '--wcm-color-fg-1': SKILLFORGE_THEME.offwhiteOpaqueMore
}
