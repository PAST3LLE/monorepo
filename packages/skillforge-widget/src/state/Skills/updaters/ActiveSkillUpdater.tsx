import { useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { useEffect } from 'react'

import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from '../../../components/Canvas/canvasApi/api/hooks'
import { ActiveSidePanel, useSidePanelAtomBase } from '../../SidePanel'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()
  const [{ type }, openSidePanel] = useSidePanelAtomBase()
  const [{ width = 0 }] = useSkillForgeWindowSizeAtom()
  const {
    active: [currentlyActive]
  } = state

  useEffect(() => {
    // TODO: fix. logic here is bad
    // TODO: maybe make panel type names include skill id in it
    const activeSkillNode = currentlyActive ? document.getElementById(currentlyActive) : null
    const panelKey: ActiveSidePanel = `ACTIVE_SKILL::${currentlyActive}`
    const wasBackArrow = type.includes(panelKey) // type.length > 1 && state.active.length <= type.length

    if (activeSkillNode) {
      !wasBackArrow && openSidePanel((state) => ({ type: [panelKey, ...state.type] }))
      // only show lightning canvas on non-mobile
      width > MEDIA_WIDTHS.upToSmall && toggleSelectedSkill(state)
      activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    } else {
      toggleSelectedSkill(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyActive, width])

  return null
}
