import React from 'react'

import { useSkillsAtom } from '../../state/Skills'
import { SkillsCanvas } from '../Canvas'
import { SkillForgeBoardContainer } from './styleds'

export function SkillForge() {
  const [state] = useSkillsAtom()

  return (
    <SkillForgeBoardContainer active={!!state.active[0]}>
      <SkillsCanvas />
    </SkillForgeBoardContainer>
  )
}
