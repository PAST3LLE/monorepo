import { useSkillsAtom } from '..'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'
import { useSidePanelAtom } from 'state/SidePanel'
import { useGetWindowSize } from 'state/WindowSize'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()
  const [, openSidePanel] = useSidePanelAtom()
  const [{ width = 0 }] = useGetWindowSize()

  useEffect(() => {
    const activeSkillNode = state.active ? document.getElementById(state.active) : null

    if (activeSkillNode) {
      openSidePanel('ACTIVE SKILL')
      // only show lightning canvas on non-mobile
      width > MEDIA_WIDTHS.upToSmall && toggleSelectedSkill(state)
      activeSkillNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    } else {
      toggleSelectedSkill(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active, width])

  return null
}
