import { ColumnCenter, Row, Text } from '@past3lle/components'
import { SkillRarity, getRarityColours } from '@past3lle/forge-web3'
import styled from 'styled-components'

import { Vector } from '../../api/vector'
import { SKILLPOINT_SIZES } from '../../constants/skills'

const StyledGridItem = styled(ColumnCenter)<{
  vector?: Vector
}>`
  width: ${SKILLPOINT_SIZES.width};
  min-width: ${SKILLPOINT_SIZES.width};
  height: ${SKILLPOINT_SIZES.height};
  padding: 2px;

  border-radius: 3px;

  position: ${({ vector }) => (!!vector ? 'absolute' : 'relative')};
  ${({ vector }) => vector && `transform: translate(${vector.X1}px,${vector.Y1}px);`}
`

export const StyledSkillpoint = styled(StyledGridItem).attrs({
  minWidth: SKILLPOINT_SIZES.width,
  justifyContent: 'center'
})<{
  dimSkill: boolean
  active: boolean
  isDependency: boolean
  isEmptySkill: boolean
  yOffset?: number
  rarity: SkillRarity | undefined
  metadataCss?: string
  css?: string
}>`
  z-index: 1;
  cursor: pointer;
  border-radius: 6px;

  background-color: ${({ theme, rarity }) => rarity && getRarityColours(theme, rarity).backgroundColor};
  box-shadow: ${({ theme, rarity }) => rarity && `0px 0px ${getRarityColours(theme, rarity).boxShadowColor}`};
  ${({ isDependency }) => isDependency && `box-shadow: 5px 5px 10px 0px #d5fb73b8, -5px -5px 10px 0px #00ff7fa8;`}
  ${({ dimSkill }) => dimSkill && `filter: brightness(0.25) grayscale(1);`}
  
  ${({ isEmptySkill, yOffset = 0, theme }) =>
    isEmptySkill &&
    `
    overflow: hidden;
    opacity: 0.76;
    padding: 0;
    box-shadow: 4px 4px 1px #00000075;
    ${
      theme.assetsMap.images.skills?.skillpoint?.empty &&
      `background: url(${theme.assetsMap.images.skills.skillpoint.empty}) 0px ${yOffset}px/cover;`
    }
  `}

  transition: filter 0.4s ease-in-out;

  &::hover {
    cursor: not-allowed;
  }

  ${({ metadataCss }) =>
    metadataCss &&
    `
    img {
      ${metadataCss}
    }
  `}
  ${({ css }) => css && css}
`

export const SkillpointHeader = styled(StyledGridItem)`
  text-align: center;

  color: ${({ theme }) => theme.canvas?.header?.collectionNumber?.color || theme.mainBg};
  font-family: ${({ theme }) => theme.canvas?.header?.collectionNumber?.fontFamily || 'Goth'};
  font-size: ${({ theme }) => theme.canvas?.header?.collectionNumber?.fontSize || '4rem'};
  font-weight: ${({ theme }) => theme.canvas?.header?.collectionNumber?.fontWeight || 900};

  margin: 0;
  padding: 0;
  justify-content: center;

  > ${Text.Small} {
    color: ${({ theme }) => theme.canvas?.header?.collectionText?.color || 'inherit'};
    font-family: ${({ theme }) => theme.canvas?.header?.collectionText?.fontFamily || 'inherit'};
    font-size: ${({ theme }) => theme.canvas?.header?.collectionText?.fontSize || '1.1rem'};
    font-variation-settings: 'wght' ${({ theme }) => theme.canvas?.header?.collectionText?.fontWeight || 100};
    font-weight: ${({ theme }) => theme.canvas?.header?.collectionText?.fontWeight || 100};
  }
`

export const SkillContainerAbsolute = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
