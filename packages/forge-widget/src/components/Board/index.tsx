import { RowProps } from '@past3lle/components'
import React from 'react'

import { useSkillsAtom } from '../../state/Skills'
import { SkillsCanvas } from '../Canvas'
import { SkilltreeBoardContainer } from './styleds'

export function Skilltree(props: RowProps) {
  const [state] = useSkillsAtom()

  return (
    <SkilltreeBoardContainer active={!!state.active[0]} {...props}>
      <SkillsCanvas />
    </SkilltreeBoardContainer>
  )
}
