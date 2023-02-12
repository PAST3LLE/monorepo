import { useSkillsAtom } from '..'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'
import { useSidePanelAtom } from 'state/SidePanel'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()
  const [, openSidePanel] = useSidePanelAtom()

  useEffect(() => {
    const activeSkillNode = state.active ? document.getElementById(state.active) : null

    if (activeSkillNode) {
      openSidePanel('ACTIVE SKILL')
      toggleSelectedSkill(state)
      activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    } else {
      toggleSelectedSkill(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active])

  return null
}
