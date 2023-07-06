import { Row, Text } from '@past3lle/components'
import {
  ForgeW3AppConfig,
  SkillId,
  SkillRarity,
  useForgeBalancesReadAtom,
  useForgeMetadataMapReadAtom,
  useForgeUserConfigAtom,
  useSupportedOrDefaultChainId
} from '@past3lle/forge-web3'
import { convertToRomanNumerals } from '@past3lle/utils'
import React, { useMemo } from 'react'

import { Vector } from '../../api/vector'
import { MARGINS } from '../../constants/grid'
import { CANVAS_CONTAINER_ID, SKILLPOINTS_CONTAINER_ID } from '../../constants/skills'
import { useVectorsAtom } from '../../state/Skills'
import { SkillContainerAbsolute, SkillpointHeader } from '../Common'
import { Skillpoint } from '../Skillpoint'
import { LightningCanvas } from './LightningCanvas'
import { SkillCanvasContainer, SkillInnerCanvasContainer } from './styleds'

export interface SkillsCanvasProps {
  options?: ForgeW3AppConfig['skillOptions']
}
export function SkillsCanvas() {
  const [{ vectors }] = useVectorsAtom()

  const chainId = useSupportedOrDefaultChainId()
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)
  const [balances] = useForgeBalancesReadAtom()
  const [
    {
      board: { minimumColumns: BOARD_COLUMNS, minimumBoardWidth }
    }
  ] = useForgeUserConfigAtom()

  const VectorsMap = useMemo(
    () =>
      vectors.map(({ skillId, vector }) => {
        if (!vector || !metadataMap) return
        const skillBalance = skillId && balances?.[skillId]
        const zeroBalance = !skillBalance || BigInt(skillBalance) === BigInt(0)

        const skillpointProps =
          skillId && metadataMap?.[skillId]
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

  const [{ dimensions }] = useVectorsAtom()
  const showRightMargin = dimensions && dimensions.columnWidth * dimensions.columns >= (window?.innerWidth || 0)

  return (
    <SkillCanvasContainer marginRight={showRightMargin ? MARGINS.SIDE : 0}>
      <Row width="100%" height={80} justifyContent="space-between" style={{ position: 'relative' }}>
        <SkillContainerAbsolute alignItems={'center'}>
          {vectors.slice(0, BOARD_COLUMNS).map(({ vector }, idx) => {
            const idxToRoman = convertToRomanNumerals(idx + 1)
            if (!vector) return null
            return (
              <SkillpointHeader key={idx} vector={new Vector(vector.X, vector.Y, vector.X1, 0)}>
                <span>{idxToRoman}</span>
                <Text.Small>COLLECTION</Text.Small>
              </SkillpointHeader>
            )
          })}
        </SkillContainerAbsolute>
      </Row>
      <SkillInnerCanvasContainer
        height="100%"
        width="100%"
        minimumBoardWidth={minimumBoardWidth}
        style={{ position: 'relative' }}
        id={CANVAS_CONTAINER_ID}
      >
        <SkillContainerAbsolute id={SKILLPOINTS_CONTAINER_ID} display={'block'}>
          {VectorsMap}
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
  image: '',
  properties: {
    id: 'EMPTY-EMPTY' as SkillId,
    rarity: 'common' as SkillRarity,
    shopifyId: '0x0',
    dependencies: []
  }
}
