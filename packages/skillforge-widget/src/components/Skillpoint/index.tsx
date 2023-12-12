import { SVG_LoadingCircleLight } from '@past3lle/assets'
import { RowCenter, RowProps, SmartImg } from '@past3lle/components'
import { SkillMetadata, SkillRarity } from '@past3lle/forge-web3'
import { isImageKitUrl, isImageSrcSet } from '@past3lle/theme'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

import { Vector } from '../../api/vector'
import { useBuildMetadataImageUri } from '../../hooks/useBuildMetadataImageUri'
import { SkillsState, useForgesAtom } from '../../state/Skills'
import { useAssetsMap } from '../../theme/utils'
import { StyledSkillpoint } from '../Common'

interface Props {
  className?: string
  metadata: SkillMetadata
  vector?: Vector
  hasSkill: boolean
  disabledHighlight?: boolean
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
  disabledHighlight,
  skillpointStyles,
  lightupDependencies
}: Props) {
  const [state, setSkillState] = useForgesAtom()
  const {
    active: [currentlyActive],
    sizes: { height }
  } = state

  const formattedUri = useBuildMetadataImageUri(metadata)

  const { isEmptySkill, isCurrentSkillActive, isDependency, isDimSkill } = useMemo(
    () => ({
      isEmptySkill: (metadata.properties.id as `${string}-${string}`) === 'EMPTY-EMPTY',
      isCurrentSkillActive: !disabledHighlight && metadata.properties.id === currentlyActive,
      isDependency: state.activeDependencies.includes(metadata.properties.id),
      get isDimSkill() {
        const otherSkillActive = !this.isDependency && !this.isCurrentSkillActive && !!currentlyActive
        return otherSkillActive || !hasSkill
      }
    }),
    [hasSkill, currentlyActive, metadata.properties.id, state.activeDependencies, disabledHighlight]
  )

  const emptySkillYOffset = useMemo(
    () => (isEmptySkill ? getSkillPlaceholderYOffset(height) : undefined),
    [height, isEmptySkill]
  )

  const handleClick = () => {
    if (isEmptySkill || isCurrentSkillActive) return
    setSkillState((state) => {
      const newState = {
        ...state,
        active: isCurrentSkillActive ? state.active.slice(1) : [metadata.properties.id, ...state.active]
      }
      // light it up
      lightupDependencies && lightupDependencies(newState)
      return newState
    })
  }

  const isCollectionSkill = !!metadata?.properties?.isCollection

  return (
    <StyledSkillpoint
      id={metadata.properties.id}
      title={`${metadata.name}_${metadata.properties.id}`}
      className={className}
      metadataCss={metadata?.attributes?.css}
      yOffset={emptySkillYOffset}
      rarity={forceRarity || (!isEmptySkill ? metadata.properties?.rarity : undefined)}
      dimSkill={isDimSkill}
      active={isCurrentSkillActive}
      isCollectionSkill={isCollectionSkill}
      isDependency={!!isDependency}
      isEmptySkill={isEmptySkill}
      vector={vector}
      onClick={handleClick}
      {...skillpointStyles}
    >
      <RowCenter
        height="100%"
        borderRadius="5px"
        overflow={'hidden'}
        css={`
          filter: ${isCollectionSkill && isDimSkill ? 'grayscale(1)' : 'unset'};
        `}
      >
        {!isEmptySkill && (
          <img src={formattedUri ? formattedUri : SVG_LoadingCircleLight} style={{ maxWidth: '100%' }} />
        )}
      </RowCenter>
      {isCurrentSkillActive && <SkillpointHighlight />}
    </StyledSkillpoint>
  )
}

export const Skillpoint = memo(SkillpointUnmemoed)

const StyledSmartImg = styled(SmartImg)`
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

  const assetUrl = assetsMap.images.skills?.skillpoint?.highlight
  if (!assetUrl) return null

  const isIkImg = isImageKitUrl(assetUrl)
  const isSrcSet = !isIkImg && isImageSrcSet(assetUrl)

  return isSrcSet ? (
    <StyledSmartImg
      path={{
        ikPath: isIkImg ? assetUrl : undefined,
        defaultUrl: isSrcSet ? assetUrl.defaultUrl : undefined
      }}
      pathSrcSet={isSrcSet ? assetUrl : undefined}
      loadInViewOptions={undefined}
    />
  ) : (
    <StyledImg src={assetUrl} />
  )
})

// TODO: fix this, 6 is magic, doesn't really make sense
// when using the assetMap in theme...
export function getSkillPlaceholderYOffset(skillYSize: number) {
  const length = 6
  const idx = Math.ceil(Math.random() * length)
  return skillYSize * idx
}
