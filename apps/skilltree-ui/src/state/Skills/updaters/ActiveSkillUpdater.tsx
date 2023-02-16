import { useSkillsAtom } from '..'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { toggleSelectedSkill } from 'components/Canvas/api/hooks'
import { useEffect } from 'react'
import { useSidePanelAtomBase } from 'state/SidePanel'
import { useGetWindowSize } from 'state/WindowSize'

export function ActiveSkillUpdater() {
  const [state] = useSkillsAtom()
  const [{ type }, openSidePanel] = useSidePanelAtomBase()
  const [{ width = 0 }] = useGetWindowSize()
  const {
    active: [currentlyActive]
  } = state

  useEffect(() => {
    // TODO: fix. logic here is bad
    // TODO: maybe make panel type names include skill id in it
    const activeSkillNode = currentlyActive ? document.getElementById(currentlyActive) : null
    const wasBackArrow = type.length > 1 && state.active.length <= type.length

    if (activeSkillNode) {
      !wasBackArrow && openSidePanel((state) => ({ type: ['ACTIVE SKILL', ...state.type] }))
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
