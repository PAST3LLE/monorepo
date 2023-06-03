import { ChainsPartialReadonly, SkillForgeW3AppConfig } from '@past3lle/skillforge-web3'

import { SkillForgeThemeByModes } from '../theme/types'

export type SkillForgeWidgetConfig<SC extends ChainsPartialReadonly = ChainsPartialReadonly> = SkillForgeW3AppConfig & {
  theme: SkillForgeThemeByModes<SC>
}
