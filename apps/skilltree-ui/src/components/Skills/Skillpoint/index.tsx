import { StyledSkillpoint } from '../common'
import { SkillMetadata } from '../types'
import { getHash } from '../utils'
import sprayBg from 'assets/png/spray.png'
import { Vector } from 'components/Canvas/api/vector'
import { GATEWAY_URI } from 'constants/ipfs'
import React, { useMemo } from 'react'
import { SkillsState, useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'

interface Props {
  metadata: SkillMetadata
  vector?: Vector
  hasSkill: boolean
  lightupDependencies?: (state: SkillsState) => void
}
export function Skillpoint({ metadata, vector, hasSkill, lightupDependencies }: Props) {
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
    if (isEmptySkill) return
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
      isEmptySkill={isEmptySkill}
      id={metadata.properties.id}
      rarity={!isEmptySkill ? metadata.properties?.rarity : undefined}
      dimSkill={!hasSkill || isOtherSkillActive}
      active={isCurrentSkillActive}
      isDependency={!!isDependency}
      onClick={handleClick}
      vector={vector}
    >
      <img src={formattedUri} style={{ maxWidth: '100%' }} crossOrigin="anonymous" />
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
`
const SprayBg = () => <StyledImg src={sprayBg} />
