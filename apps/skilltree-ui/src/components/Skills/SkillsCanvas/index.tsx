import { Skillpoint } from '../Skillpoint'
import { SkillContainerAbsolute, SkillpointHeader } from '../common'
import { Rarity } from '../types'
import { SkillCanvasContainer, SkillInnerCanvasContainer } from './styleds'
import { Row } from '@past3lle/components'
import { convertToRomanNumerals } from '@past3lle/utils'
import { LightningCanvas } from 'components/Canvas'
import { Vector } from 'components/Canvas/api/vector'
import { EMPTY_SKILL_IMAGE_HASH_LIST, MINIMUM_COLLECTION_BOARD_SIZE } from 'constants/skills'
import { BigNumber } from 'ethers'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import { useUserAtom } from 'state/User'

export function SkillsCanvas() {
  const [state] = useSkillsAtom()
  const { vectors } = state
  const [{ balances }] = useUserAtom()

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
            const skillBalance = skill && balances[skill.properties.id]
            const missingSkill = !skillBalance || !skill || BigNumber.from(balances[skill.properties.id]).isZero()

            const props = skill
              ? {
                  key: skill.properties.id,
                  metadata: skill,
                  hasSkill: !missingSkill
                }
              : { key: `EMPTY-${vector.X1}-${vector.Y1}`, metadata: EMPTY_METADATA, hasSkill: true }
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
  get image() {
    const length = EMPTY_SKILL_IMAGE_HASH_LIST.length
    const idx = Math.floor(Math.random() * length)
    return EMPTY_SKILL_IMAGE_HASH_LIST[idx]
  },
  properties: {
    id: 'EMPTY-EMPTY' as `${string}-${string}`,
    rarity: 'common' as Rarity,
    shopifyId: '0x0',
    dependencies: []
  }
}
