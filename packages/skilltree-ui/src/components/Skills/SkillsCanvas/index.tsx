import { LightningCanvas } from '../../Canvas'
import { SkillColumn } from '../SkillsColumn'
import { useMetadata } from '../hooks'
import { Row } from '@past3lle/components'
import styled from 'styled-components'

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
