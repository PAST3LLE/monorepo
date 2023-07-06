import { SkillId, useForgeMetadataMapReadAtom, useSupportedChainId } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { useEffect } from 'react'

import { useForgesAtom, useVectorsAtom } from '..'
import { toggleSelectedSkill } from '../../../api/hooks'
import { ActiveSidePanel, useSidePanelAtomBase } from '../../SidePanel'

export function ActiveSkillUpdater() {
  const chainId = useSupportedChainId()

  const [{ type }, openSidePanel] = useSidePanelAtomBase()
  const isMobileWidthOrDevice = useIsMobile()
  const [skillsState, updateSkillsState] = useForgesAtom()
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)
  const [vectorsState] = useVectorsAtom()

  // Updates the activeDepedencies whenever the active skill changes
  useEffect(() => {
    const activeSkill = skillsState.active[0]
    if (activeSkill && metadataMap?.[activeSkill]) {
      updateSkillsState((state) => ({
        ...state,
        activeDependencies: metadataMap[activeSkill].properties.dependencies.map(
          ({ token, id }) => `${token}-${id}` as SkillId
        )
      }))
    } else {
      updateSkillsState((state) => ({
        ...state,
        activeDependencies: state.activeDependencies.slice(1)
      }))
    }
  }, [metadataMap, skillsState.active, updateSkillsState])

  // handles ActivePanel history
  // toggles skill effects and auto-scrolls to active skill
  useEffect(() => {
    if (typeof document === undefined) return
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
        activeSkillNode.scrollIntoView({ block: 'nearest', inline: 'center' })
      }
    } else {
      toggleSelectedSkill(undefined)
    }
  }, [openSidePanel, skillsState, vectorsState, type, isMobileWidthOrDevice])

  return null
}
