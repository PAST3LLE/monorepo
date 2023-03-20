import { useIsMobile } from '@past3lle/hooks'
import { useEffect } from 'react'

import { useSkillsAtom, useVectorsAtom } from '..'
import { toggleSelectedSkill } from '../../../components/Canvas/canvasApi/api/hooks'
import { ActiveSidePanel, useSidePanelAtomBase } from '../../SidePanel'

export function ActiveSkillUpdater() {
  const [{ type }, openSidePanel] = useSidePanelAtomBase()
  const isMobileWidthOrDevice = useIsMobile()
  const [skillsState] = useSkillsAtom()
  const [vectorsState] = useVectorsAtom()

  useEffect(() => {
    const activeSkillNode = document.getElementById(skillsState.active[0])
    if (activeSkillNode) {
      const panelKey: ActiveSidePanel = `ACTIVE_SKILL::${skillsState.active[0]}`
      const wasBackArrow = type.includes(panelKey)

      // open a new panel if it wasn't a backwards move.
      // this is to prevent toggling closed a panel that would otherwise be opened
      if (!wasBackArrow) {
        openSidePanel((panelsState) => ({ type: [panelKey, ...panelsState.type] }))
      }

      // only non-mobile (web) sizes
      // 1. show lightning effect
      // 2. auto-scroll to active skill
      if (!isMobileWidthOrDevice) {
        toggleSelectedSkill(vectorsState, skillsState)
        activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    } else {
      toggleSelectedSkill(undefined)
    }
  }, [openSidePanel, skillsState, vectorsState, type, isMobileWidthOrDevice])

  return null
}
