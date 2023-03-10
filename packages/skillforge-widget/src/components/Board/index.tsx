import { useStateRef } from '@past3lle/hooks'
import React from 'react'

import { useSkillsAtom } from '../../state/Skills'
import { SkillsCanvas } from '../Canvas'
import { SkillForgeBoardContainer } from './styleds'

export const SkillForgeComponentContext = React.createContext(0)

export function SkillForge() {
  const [state] = useSkillsAtom()
  const [width, setRef] = useStateRef(0, (node: HTMLElement | undefined) => node?.clientWidth || 0)

  return (
    <SkillForgeComponentContext.Provider value={width}>
      <SkillForgeBoardContainer active={!!state.active[0]} ref={setRef}>
        <SkillsCanvas />
      </SkillForgeBoardContainer>
    </SkillForgeComponentContext.Provider>
  )
}
