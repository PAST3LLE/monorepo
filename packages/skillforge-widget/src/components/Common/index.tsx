import { ColumnCenter, Row, Text } from '@past3lle/components'
import { SkillRarity, getRarityColours } from '@past3lle/forge-web3'
import styled, { DefaultTheme } from 'styled-components'

import { Vector } from '../../api/vector'
import { SKILLPOINT_SIZES } from '../../constants/skills'

type StyledGridItemProps = {
  vector?: Vector
  position: string
  transform: string
  background: string
  boxShadow: string
  filter: string
}

const StyledBaseGridItem = styled(ColumnCenter).attrs((props) => ({
  ...props,
  width: props.width || SKILLPOINT_SIZES.width,
  minWidth: props.minWidth || SKILLPOINT_SIZES.width,
  height: props.height || SKILLPOINT_SIZES.height
}))<StyledGridItemProps>`
  padding: 2px;
  border-radius: 3px;
  position: ${(props) => props.position};
  transform: ${(props) => props.transform};

  background: ${(props) => props.background};
  box-shadow: ${(props) => props.boxShadow};
  filter: ${(props) => props.filter};
`

const StyledGridItem = styled(StyledBaseGridItem).attrs((props: StyledGridItemProps) => ({
  position: !!props.vector ? 'absolute' : 'relative',
  transform: props.vector ? `translate(${props.vector.X1}px,${props.vector.Y1}px)` : 'unset'
}))``

type StyledSkillpointProps = {
  dimSkill: boolean
  active: boolean
  isCollectionSkill?: boolean
  isDependency: boolean
  isEmptySkill: boolean
  yOffset?: number
  rarity: SkillRarity | undefined
  metadataCss?: string
  css?: string
}
export const StyledSkillpoint = styled(StyledGridItem).attrs(
  ({
    theme,
    rarity,
    isDependency,
    isCollectionSkill = false,
    isEmptySkill
  }: // yOffset
  StyledSkillpointProps & { theme: DefaultTheme }) => ({
    justifyContent: 'center',
    backgroundColor: rarity ? getRarityColours(theme, rarity).backgroundColor : 'none',
    boxShadow: rarity
      ? `0px 0px ${isCollectionSkill ? `12px 2px ${theme.mainBg}` : getRarityColours(theme, rarity).boxShadowColor}`
      : isDependency
      ? '5px 5px 10px 0px #d5fb73b8, -5px -5px 10px 0px #00ff7fa8'
      : isEmptySkill
      ? '4px 4px 1px #00000075'
      : 'unset',
    padding: isEmptySkill ? '0' : 'initial',
    opacity: isEmptySkill ? 0.76 : 1,
    overflow: isEmptySkill ? 'hidden' : 'initial'
  })
)<StyledSkillpointProps>`
  z-index: 1;
  cursor: pointer;
  border-radius: 6px;

  transition: filter 0.4s ease-in-out;

  &::hover {
    cursor: not-allowed;
  }
`

export const SkillpointHeader = styled(StyledGridItem).attrs({
  filter: 'none',
  boxShadow: 'none',
  background: 'transparent'
})`
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
