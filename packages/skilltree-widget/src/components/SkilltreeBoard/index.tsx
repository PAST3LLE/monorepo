import React from 'react'

import { useSkillsAtom } from '../../state/Skills'
import { SkillsCanvas } from '../SkillsCanvas'
import { SkilltreeBoardContainer } from './styleds'

export function SkilltreeBoard() {
  const [state] = useSkillsAtom()
  return (
    <SkilltreeBoardContainer active={!!state.active[0]}>
      <SkillsCanvas />
    </SkilltreeBoardContainer>
  )
}
