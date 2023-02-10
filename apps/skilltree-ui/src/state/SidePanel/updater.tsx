import { useSidePanelAtom } from '.'
import { ActiveSkillPanel } from 'components/Skills/ActiveSkillPanel'
import { UserStatsPanel } from 'components/UserStatsPanel'
import React from 'react'

export function SidePanelUpdater() {
  const [sidePanelState] = useSidePanelAtom()

  switch (sidePanelState.type) {
    case 'ACTIVE_SKILL':
      return <ActiveSkillPanel />
    case 'USER_STATS':
      return <UserStatsPanel />
    default:
      return null
  }
}
