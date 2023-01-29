import { Row } from '@past3lle/components'
import { LightningCanvas } from 'components/Canvas'
import { SkillColumn } from 'components/Skills/SkillsColumn'
import { useMetadata } from 'components/Skills/hooks'
import React from 'react'
import styled from 'styled-components/macro'

const SkilltreeCanvasContainer = styled(Row)`
  position: relative;
  padding: 2rem;
  height: 100%;
`

export function SkillsCanvas() {
  const metadata = useMetadata()
  return (
    <SkilltreeCanvasContainer>
      <SkillColumn header="i" skills={metadata.skills} />
      <SkillColumn header="ii" skills={[]} />
      <SkillColumn header="iii" skills={[]} />
      {/* CANVAS */}
      <LightningCanvas />
    </SkilltreeCanvasContainer>
  )
}
