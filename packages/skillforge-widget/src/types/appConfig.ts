import { ChainsPartialReadonly, ForgeW3AppConfig, SupportedForgeChains } from '@past3lle/forge-web3'

import { SkillForgeThemeByModes } from '../theme/types'

export type SkillForgeWidgetConfig = ForgeW3AppConfig & {
  theme: SkillForgeThemeByModes<ChainsPartialReadonly<SupportedForgeChains>>
}
