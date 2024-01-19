import { ForgeChainsMinimum, ForgeW3AppConfig } from '@past3lle/forge-web3'

import { SkillForgeThemeByModes } from '../theme/types'

export type SkillForgeWidgetConfig<chains extends ForgeChainsMinimum> = ForgeW3AppConfig<chains> & {
  theme: SkillForgeThemeByModes<chains>
}
