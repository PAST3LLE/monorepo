import React from 'react'

import { useSkillsAtom } from '../../state/Skills'
import { SkillsCanvas } from '../Canvas'
import { SkilltreeBoardContainer } from './styleds'

export function Skilltree() {
  const [state] = useSkillsAtom()

  return (
    <SkilltreeBoardContainer active={!!state.active[0]}>
      <SkillsCanvas />
    </SkilltreeBoardContainer>
  )
}
