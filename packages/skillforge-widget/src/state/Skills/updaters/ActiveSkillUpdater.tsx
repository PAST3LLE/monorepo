import { useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { useEffect } from 'react'

import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from '../../../components/Canvas/canvasApi/api/hooks'
import { ActiveSidePanel, useSidePanelAtomBase } from '../../SidePanel'

export function ActiveSkillUpdater() {
  const [{ type }, openSidePanel] = useSidePanelAtomBase()
  const [{ width = 0 }] = useSkillForgeWindowSizeAtom()
  const [state] = useSkillsAtom()

  useEffect(() => {
    const activeSkillNode = document.getElementById(state.active[0])
    if (activeSkillNode) {
      const panelKey: ActiveSidePanel = `ACTIVE_SKILL::${state.active[0]}`
      const wasBackArrow = type.includes(panelKey)

      !wasBackArrow && openSidePanel((state) => ({ type: [panelKey, ...state.type] }))
      // only non-mobile (web) sizes
      // 1. show lightning effect
      // 2. auto-scroll to active skill
      if (width > MEDIA_WIDTHS.upToSmall) {
        toggleSelectedSkill(state)
        activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    } else {
      toggleSelectedSkill(undefined)
    }
  }, [openSidePanel, state, type, width])

  return null
}
