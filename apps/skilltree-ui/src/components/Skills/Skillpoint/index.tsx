import { StyledSkillpoint } from '../common'
import { SkillMetadata } from '../types'
import { getHash } from '../utils'
import sprayBg from 'assets/png/spray.png'
import { Vector } from 'components/Canvas/api/vector'
import { GATEWAY_URI } from 'constants/ipfs'
import React from 'react'
import { useSkillsAtom } from 'state/Skills'
import styled from 'styled-components/macro'

interface Props {
  metadata: SkillMetadata
  vector?: Vector
}
export function Skillpoint({ metadata, vector }: Props) {
  const [state, setSkillState] = useSkillsAtom()
  const formattedUri = getHash(metadata.image)

  const isActive = metadata.properties.id === state.active
  const isDependency = state.activeDependencies.includes(metadata.properties.id)

  const handleClick = () =>
    setSkillState((state) => ({
      ...state,
      active: isActive ? undefined : metadata.properties.id,
      activeDependencies: isActive ? [] : metadata.properties.dependencies,
    }))

  return (
    <StyledSkillpoint
      rarity={metadata.properties?.rarity}
      active={isActive}
      isDependency={!!isDependency}
      onClick={handleClick}
      vector={vector}
    >
      <img src={`${GATEWAY_URI}/${formattedUri}`} style={{ maxWidth: '100%' }} />
      {isActive && <SprayBg />}
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
