import { StyledSkillpoint } from '../common'
import { Rarity, SkillMetadata } from '../types'
import { getHash } from '../utils'
import { RowCenter } from '@past3lle/components'
import sprayBg from 'assets/png/spray.png'
import { Vector } from 'components/Canvas/api/vector'
import { GATEWAY_URI } from 'constants/ipfs'
import React, { useMemo } from 'react'
import { BoxProps } from 'rebass'
import { SkillsState, useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'

interface Props {
  className?: string
  metadata: SkillMetadata
  vector?: Vector
  hasSkill: boolean
  forceRarity?: Rarity | 'empty'
  skillpointStyles?: BoxProps
  lightupDependencies?: (state: SkillsState) => void
}
export function Skillpoint({
  className,
  metadata,
  vector,
  forceRarity,
  hasSkill,
  skillpointStyles,
  lightupDependencies
}: Props) {
  const [state, setSkillState] = useSkillsAtom()
  const {
    active: [currentlyActive]
  } = state

  const formattedUri = useMemo(() => `${GATEWAY_URI}/${getHash(metadata.image)}`, [metadata.image])
  const { isEmptySkill, isCurrentSkillActive, isDependency, isOtherSkillActive } = useMemo(
    () => ({
      isEmptySkill: metadata.properties.id === 'EMPTY-EMPTY',
      isCurrentSkillActive: metadata.properties.id === currentlyActive,
      isDependency: state.activeDependencies.includes(metadata.properties.id),
      get isOtherSkillActive() {
        return !this.isDependency && !this.isCurrentSkillActive && !!currentlyActive
      }
    }),
    [currentlyActive, metadata.properties.id, state.activeDependencies]
  )

  const handleClick = () => {
    if (isEmptySkill || isCurrentSkillActive) return
    setSkillState((state) => {
      const newState = {
        ...state,
        active: isCurrentSkillActive ? state.active.slice(1) : [metadata.properties.id, ...state.active],
        activeDependencies: isCurrentSkillActive ? [] : metadata.properties.dependencies
      }
      // light it up
      lightupDependencies && lightupDependencies(newState)
      return newState
    })
  }

  return (
    <StyledSkillpoint
      title={`${metadata.name}_${metadata.properties.id}`}
      className={className}
      isEmptySkill={isEmptySkill}
      id={metadata.properties.id}
      rarity={forceRarity || (!isEmptySkill ? metadata.properties?.rarity : undefined)}
      dimSkill={!hasSkill || isOtherSkillActive}
      active={isCurrentSkillActive}
      isDependency={!!isDependency}
      onClick={handleClick}
      vector={vector}
      {...skillpointStyles}
    >
      <RowCenter height="100%" borderRadius="5px" overflow={'hidden'}>
        <img src={formattedUri} style={{ maxWidth: '100%' }} />
      </RowCenter>
      {isCurrentSkillActive && <SprayBg />}
    </StyledSkillpoint>
  )
}

const StyledImg = styled.img`
  z-index: -1;
  position: absolute;

  width: 280%;
  height: 280%;

  top: -100%;
  left: -76%;

  overflow-clip-margin: unset;
  max-inline-size: unset;
  max-block-size: unset;

  pointer-events: none;
`
const SprayBg = () => <StyledImg src={sprayBg} />
