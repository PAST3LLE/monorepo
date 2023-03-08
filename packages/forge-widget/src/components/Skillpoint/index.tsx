import { RowCenter, RowProps } from '@past3lle/components'
import { GATEWAY_URI, getHash } from '@past3lle/forge-web3'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

import { SkillsState, useSkillsAtom } from '../../state/Skills'
import { useAssetsMap } from '../../theme/utils'
import { SkillMetadata, SkillRarity } from '../../types'
import { Vector } from '../Canvas/canvasApi/api/vector'
import { StyledSkillpoint } from '../Common'

interface Props {
  className?: string
  metadata: SkillMetadata
  vector?: Vector
  hasSkill: boolean
  forceRarity?: SkillRarity | 'empty'
  skillpointStyles?: RowProps
  lightupDependencies?: (state: SkillsState) => void
}
function SkillpointUnmemoed({
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
      metadataCss={metadata?.attributes?.css}
      isEmptySkill={isEmptySkill}
      id={metadata.properties.id}
      rarity={forceRarity || (!isEmptySkill ? metadata.properties?.rarity : undefined)}
      dimSkill={!hasSkill || isOtherSkillActive}
      active={isCurrentSkillActive}
      isDependency={!!isDependency}
      vector={vector}
      onClick={handleClick}
      {...skillpointStyles}
    >
      <RowCenter height="100%" borderRadius="5px" overflow={'hidden'}>
        <img src={formattedUri} style={{ maxWidth: '100%' }} />
      </RowCenter>
      {isCurrentSkillActive && <SkillpointHighlight />}
    </StyledSkillpoint>
  )
}

export const Skillpoint = memo(
  SkillpointUnmemoed,
  (prevProps, nextProps) =>
    prevProps.vector?.X1 !== nextProps.vector?.X1 && prevProps.vector?.Y1 !== nextProps.vector?.Y1
)

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
const SkillpointHighlight = memo(() => {
  const assetsMap = useAssetsMap()
  return <StyledImg src={assetsMap.images.skills?.skillpoint?.highlight} />
})
