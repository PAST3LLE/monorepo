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

  return useMemo(() => {
    switch (panelType) {
      case 'ACTIVE SKILL':
        return <ActiveSkillPanel />
      case 'USER STATS':
        return <UserStatsPanel />
      default:
        return null
    }
  }, [panelType])
}
