import { Skillpoint } from '../Skillpoint'
import { SkillContainerAbsolute, SkillpointHeader } from '../common'
import { SkillCanvasContainer, SkillInnerCanvasContainer } from './styleds'
import { Row } from '@past3lle/components'
import { convertToRomanNumerals } from '@past3lle/utils'
import { LightningCanvas } from 'components/Canvas'
import { Vector } from 'components/Canvas/api/vector'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'

// import { useSkillsContract } from 'web3/hooks/skills/useSkillsContract'

export function SkillsCanvas() {
  // const skillContractApi = useSkillsContract(2)

  const [state] = useSkillsAtom()
  const { vectors, metadata } = state

  return (
    <SkillCanvasContainer style={{ position: 'relative' }}>
      <Row width={'100%'} height={'12%'} justifyContent="space-between" style={{ position: 'relative' }}>
        <SkillContainerAbsolute>
          {vectors.slice(0, metadata.length).map(({ vector }, idx) => {
            const idxToRoman = convertToRomanNumerals(idx + 1)
            if (!vector) return null
            return (
              <SkillpointHeader key={idx} vector={new Vector(vector.X, vector.Y, vector.X1, 0)}>
                {idxToRoman}
              </SkillpointHeader>
            )
          })}
        </SkillContainerAbsolute>
      </Row>
      <SkillInnerCanvasContainer height={'100%'} width="100%" style={{ position: 'relative' }} id="CANVAS-CONTAINER">
        <SkillContainerAbsolute>
          {vectors.map(({ skill, vector }) => {
            if (!skill) return null
            return <Skillpoint key={skill.properties.id} metadata={skill} vector={vector} />
          })}
        </SkillContainerAbsolute>
        {/* CANVAS */}
        <LightningCanvas />
      </SkillInnerCanvasContainer>
    </SkillCanvasContainer>
  )
}
