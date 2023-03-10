import React, { useMemo } from 'react'

import { useSidePanelAtomBase } from '..'
import { ActiveSkillPanel } from '../../../components/Panels/ActiveSkillPanel'
import { UserStatsPanel } from '../../../components/Panels/UserStatsPanel'

export function SidePanelUpdater() {
  const [
    {
      type: [panelType]
    }
  ] = useSidePanelAtomBase()

  const type = panelType?.split('::')?.[0] as 'ACTIVE_SKILL' | 'USER_STATS' | undefined

  return useMemo(() => {
    switch (type) {
      case 'ACTIVE_SKILL':
        return <ActiveSkillPanel />
      case 'USER_STATS':
        return <UserStatsPanel />
      default:
        return null
    }
  }, [type])
}
