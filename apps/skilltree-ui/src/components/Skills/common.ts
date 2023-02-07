import { getRarityColours } from './utils'
import { Row } from '@past3lle/components'
import { Vector } from 'components/Canvas/api/vector'
import { Rarity } from 'components/Skills/types'
import styled from 'styled-components/macro'

const StyledGridItem = styled(Row)<{
  vector?: Vector
}>`
  width: 10vh;
  height: 10vh;
  padding: 6px;

  border-radius: 3px;

  position: ${({ vector }) => (!!vector ? 'absolute' : 'relative')};
  ${({ vector }) => vector && `transform: translate(${vector.X1}px,${vector.Y1}px);`}
`

export const StyledSkillpoint = styled(StyledGridItem)<{
  dimSkill: boolean
  active: boolean
  isDependency: boolean
  rarity: Rarity | undefined
}>`
  z-index: 1;
  cursor: pointer;

  // background-color: ${({ rarity }) => getRarityColours(rarity).backgroundColor};
  background-color: #000000ba;
  box-shadow: ${({ rarity }) => `0px 0px ${getRarityColours(rarity).boxShadowColor}`};
  ${({ isDependency }) => isDependency && `box-shadow: 5px 5px 10px 0px #d5fb73b8, -5px -5px 10px 0px #00ff7fa8;`}
  ${({ dimSkill }) => dimSkill && `filter: brightness(0.25) saturate(5);`}

  transition: filter 1.2s ease-in-out;
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
