import { useIsMobile, useStateRef } from '@past3lle/hooks'
import React from 'react'

import { useActiveSkillReadAtom } from '../../state/Skills'
import { SkillsCanvas } from '../Canvas'
import { SkillForgeBoardContainer } from './styleds'

export const SkillForgeComponentContext = React.createContext(0)

export function SkillForge() {
  const [[active]] = useActiveSkillReadAtom()
  const [width, setRef] = useStateRef(0, (node: HTMLElement | undefined) => node?.clientWidth || 0)

  const isMobileWidthOrDevice = useIsMobile()
  const skillActive = !isMobileWidthOrDevice && !!active

  return (
    <SkillForgeComponentContext.Provider value={width}>
      <SkillForgeBoardContainer active={skillActive} ref={setRef}>
        <SkillsCanvas />
      </SkillForgeBoardContainer>
    </SkillForgeComponentContext.Provider>
  )
}
