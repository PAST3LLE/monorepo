import React, { useMemo } from 'react'

import { useSidePanelAtomBase } from '..'
import { ActiveSkillPanel } from '../../../components/Panels/ActiveSkillPanel'
import { TradeAndUnlockPanel } from '../../../components/Panels/TradeAndUnlockPanel'
import { UserStatsPanel } from '../../../components/Panels/UserStatsPanel'

export function SidePanelUpdater() {
  const [
    {
      type: [panelType]
    }
  ] = useSidePanelAtomBase()

  const type = panelType?.split('::')?.[0] as 'ACTIVE_SKILL' | 'USER_STATS' | 'UNLOCK_SKILL' | undefined

  return useMemo(() => {
    switch (type) {
      case 'ACTIVE_SKILL':
        return <ActiveSkillPanel />
      case 'USER_STATS':
        return <UserStatsPanel />
      case 'UNLOCK_SKILL':
        return <TradeAndUnlockPanel />
      default:
        return null
    }
  }, [type])
}
