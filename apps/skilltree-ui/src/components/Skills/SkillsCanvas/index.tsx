import { Skillpoint } from '../Skillpoint'
import { SkillContainerAbsolute, SkillpointHeader } from '../common'
import { Rarity } from '../types'
import { SkillCanvasContainer, SkillInnerCanvasContainer } from './styleds'
import { Row } from '@past3lle/components'
import { convertToRomanNumerals } from '@past3lle/utils'
import { LightningCanvas } from 'components/Canvas'
import { Vector } from 'components/Canvas/api/vector'
import { MINIMUM_COLLECTION_BOARD_SIZE } from 'constants/skills'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'

// import { useSkillsContract } from 'web3/hooks/skills/useSkillsContract'

export function SkillsCanvas() {
  // const skillContractApi = useSkillsContract(2)

  const [state] = useSkillsAtom()
  const { vectors } = state

  return (
    <SkillCanvasContainer style={{ position: 'relative' }}>
      <Row width={'100%'} height={'12%'} justifyContent="space-between" style={{ position: 'relative' }}>
        <SkillContainerAbsolute>
          {vectors.slice(0, MINIMUM_COLLECTION_BOARD_SIZE).map(({ vector }, idx) => {
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
            if (!vector) return

            const props = skill
              ? { key: skill.properties.id, metadata: skill }
              : { key: `EMPTY-${vector.X1}-${vector.Y1}`, metadata: EMPTY_METADATA }
            return <Skillpoint {...props} vector={vector} />
          })}
        </SkillContainerAbsolute>
        {/* CANVAS */}
        <LightningCanvas />
      </SkillInnerCanvasContainer>
    </SkillCanvasContainer>
  )
}

const EMPTY_METADATA = {
  name: 'EMPTY_SKILL',
  description: 'Empty skill',
  image: 'ipfs://QmYrEBgtKLj9FG2aQzZRSF2BYPnB6XUGXT4qKPGH2dUqFh',
  properties: {
    id: 'EMPTY-EMPTY' as `${string}-${string}`,
    rarity: 'common' as Rarity,
    shopifyId: '0x0',
    dependencies: []
  }
}
