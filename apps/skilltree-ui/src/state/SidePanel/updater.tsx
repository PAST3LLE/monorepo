import { useSidePanelAtom } from '.'
import { ActiveSkillPanel } from 'components/Skills/ActiveSkillPanel'
import { UserStatsPanel } from 'components/UserStatsPanel'
import React, { useMemo } from 'react'

export function SidePanelUpdater() {
  const [[panelType]] = useSidePanelAtom()

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
