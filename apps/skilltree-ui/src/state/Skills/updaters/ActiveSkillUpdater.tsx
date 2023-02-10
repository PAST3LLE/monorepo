import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'
import { useSidePanelAtom } from 'state/SidePanel'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()
  const [, openSidePanel] = useSidePanelAtom()

  useEffect(() => {
    openSidePanel({ type: 'ACTIVE_SKILL' })
    toggleSelectedSkill(state)

    const activeSkillNode = state.active ? document.getElementById(state.active) : null
    if (activeSkillNode) {
      activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active])

  return null
}
