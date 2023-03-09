import { ForgeW3AppConfig } from '@past3lle/forge-web3'

import { SkilltreeThemeByModes } from '../theme/types'

export type ForgeWidgetAppConfig = ForgeW3AppConfig & {
  theme: SkilltreeThemeByModes
}
