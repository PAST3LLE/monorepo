import { BigNumber } from '@ethersproject/bignumber'
import { Row } from '@past3lle/components'
import {
  SkillForgeW3AppConfig,
  SkillId,
  SkillRarity,
  useSkillForgeBalancesAtom,
  useSkillForgeMetadataMapReadAtom
} from '@past3lle/skillforge-web3'
import { convertToRomanNumerals } from '@past3lle/utils'
import React, { useMemo } from 'react'

import { CANVAS_CONTAINER_ID, MINIMUM_COLLECTION_BOARD_SIZE } from '../../constants/skills'
import { useVectorsAtom } from '../../state/Skills'
import { SkillContainerAbsolute, SkillpointHeader } from '../Common'
import { Skillpoint } from '../Skillpoint'
import { LightningCanvas } from './canvasApi'
import { Vector } from './canvasApi/api/vector'
import { SkillCanvasContainer, SkillInnerCanvasContainer } from './styleds'

export interface SkillsCanvasProps {
  options?: SkillForgeW3AppConfig['skillOptions']
}
export function SkillsCanvas() {
  const [{ vectors }] = useVectorsAtom()
  const [metadataMap] = useSkillForgeMetadataMapReadAtom()
  const [{ balances }] = useSkillForgeBalancesAtom()

  const VectorsMap = useMemo(
    () =>
      vectors.map(({ skillId, vector }) => {
        if (!vector) return
        const skillBalance = skillId && balances?.[skillId]
        const missingSkill = !skillBalance || !skillId
        const zeroBalance = !!skillBalance && BigNumber.from(skillBalance).isZero()

        const skillpointProps = !missingSkill
          ? {
              key: skillId,
              metadata: metadataMap[skillId],
              hasSkill: !zeroBalance
            }
          : { key: `EMPTY-${vector.X1}-${vector.Y1}`, metadata: EMPTY_METADATA, hasSkill: true }
        return <Skillpoint {...skillpointProps} vector={vector} />
      }),
    [balances, metadataMap, vectors]
  )

  return (
    <SkillCanvasContainer style={{ position: 'relative' }}>
      <Row width="100%" height={80} justifyContent="space-between" style={{ position: 'relative' }}>
        <SkillContainerAbsolute>
          {vectors.slice(0, MINIMUM_COLLECTION_BOARD_SIZE).map(({ vector }, idx) => {
            const idxToRoman = convertToRomanNumerals(idx + 1)
            if (!vector) return null
            return (
              <SkillpointHeader key={idx} vector={new Vector(vector.X, vector.Y, vector.X1, 0)} height={70}>
                {idxToRoman}
              </SkillpointHeader>
            )
          })}
        </SkillContainerAbsolute>
      </Row>
      <SkillInnerCanvasContainer height="100%" width="100%" style={{ position: 'relative' }} id={CANVAS_CONTAINER_ID}>
        <SkillContainerAbsolute>{VectorsMap}</SkillContainerAbsolute>
        {/* CANVAS */}
        <LightningCanvas />
      </SkillInnerCanvasContainer>
    </SkillCanvasContainer>
  )
}

const EMPTY_METADATA = {
  name: 'EMPTY_SKILL',
  description: 'Empty skill',
  image: '',
  properties: {
    id: 'EMPTY-EMPTY' as SkillId,
    rarity: 'common' as SkillRarity,
    shopifyId: '0x0',
    dependencies: []
  }
}
