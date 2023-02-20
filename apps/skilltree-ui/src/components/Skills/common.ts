import { getRarityColours } from './utils'
import { Row } from '@past3lle/components'
import { Vector } from 'components/Canvas/api/vector'
import { Rarity } from 'components/Skills/types'
import { SKILLPOINT_SIZES } from 'constants/skills'
import styled from 'styled-components/macro'

const StyledGridItem = styled(Row)<{
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
  rarity: Rarity | undefined
  css?: string
}>`
  z-index: 1;
  cursor: pointer;
  border-radius: 6px;

  background-color: ${({ rarity }) => rarity && getRarityColours(rarity).backgroundColor};
  box-shadow: ${({ rarity }) => rarity && `0px 0px ${getRarityColours(rarity).boxShadowColor}`};
  ${({ isDependency }) => isDependency && `box-shadow: 5px 5px 10px 0px #d5fb73b8, -5px -5px 10px 0px #00ff7fa8;`}
  ${({ dimSkill }) => dimSkill && `filter: brightness(0.25) grayscale(1);`}
  
  ${({ isEmptySkill }) =>
    isEmptySkill &&
    `
    overflow: hidden;
    opacity: 0.76;
    padding: 0;
    box-shadow: 4px 4px 1px #00000075;
  `}

  transition: filter 0.4s ease-in-out;

  &::hover {
    cursor: not-allowed;
  }

  ${({ css }) => css && css}
`

export const SkillpointHeader = styled(StyledGridItem)`
  font-family: 'Goth';
  font-weight: 900;
  font-size: 6rem;
  color: ${({ theme }) => theme.mainBg};
  margin: 0;
  text-align: center;
  justify-content: center;
`

export const SkillContainerAbsolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
