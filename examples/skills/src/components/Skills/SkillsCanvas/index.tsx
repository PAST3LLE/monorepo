import { Row } from '@past3lle/components'
import * as React from 'react'
import styled from 'styled-components'

import { LightningCanvas } from '../../../components/Canvas'
import { SkillColumn } from '../SkillsColumn'
import { useMetadata } from '../hooks'

const SkilltreeCanvasContainer = styled(Row)`
  position: relative;
  padding: 2rem;
  height: 100%;
`

export function SkillsCanvas() {
  const metadata = useMetadata()
  return (
    <SkilltreeCanvasContainer>
      <SkillColumn
        header="i"
        skills={metadata.skills}
        /* boxProps={{ alignItems: "flex-start" }} */
      />
      <SkillColumn header="ii" skills={metadata.skills} />
      <SkillColumn
        header="iii"
        skills={metadata.skills}
        /* boxProps={{ alignItems: "flex-end" }} */
      />
      {/* CANVAS */}
      <LightningCanvas />
    </SkilltreeCanvasContainer>
  )
}
