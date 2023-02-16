import { StyledSkillpoint } from '../common'
import { SkillMetadata } from '../types'
import { getHash } from '../utils'
import sprayBg from 'assets/png/spray.png'
import { Vector } from 'components/Canvas/api/vector'
import { GATEWAY_URI } from 'constants/ipfs'
import React from 'react'
import { SkillsState, useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'

interface Props {
  metadata: SkillMetadata
  vector?: Vector
  lightupDependencies?: (state: SkillsState) => void
}
export function Skillpoint({ metadata, vector, lightupDependencies }: Props) {
  const [state, setSkillState] = useSkillsAtom()
  const formattedUri = getHash(metadata.image)
  const {
    active: [currentlyActive]
  } = state

  const isEmptySkill = metadata.properties.id === 'EMPTY-EMPTY'
  const isCurrentSkillActive = metadata.properties.id === currentlyActive
  const isDependency = state.activeDependencies.includes(metadata.properties.id)
  const isOtherSkillActive = !isDependency && !isCurrentSkillActive && !!currentlyActive

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
      dimSkill={isOtherSkillActive}
      active={isCurrentSkillActive}
      isDependency={!!isDependency}
      onClick={handleClick}
      vector={vector}
    >
      <img src={`${GATEWAY_URI}/${formattedUri}`} style={{ maxWidth: '100%' }} />
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
