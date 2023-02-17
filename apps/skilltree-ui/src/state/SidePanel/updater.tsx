import { useSidePanelAtomBase } from '.'
import { ActiveSkillPanel } from 'components/Skills/ActiveSkillPanel'
import { UserStatsPanel } from 'components/UserStatsPanel'
import React, { useMemo } from 'react'

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
