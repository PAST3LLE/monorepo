import { SVG_LoadingCircleLight } from '@past3lle/assets'
import { RowCenter, RowProps, SmartImg } from '@past3lle/components'
import { SkillMetadata, SkillRarity } from '@past3lle/forge-web3'
import { BackgroundPropertyFull, MediaWidths, isImageKitUrl, isImageSrcSet } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import React, { memo, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { Vector } from '../../api/vector'
import { useBuildMetadataImageUriQuery } from '../../hooks/useBuildMetadataImageUri'
import { SkillsState, useForgesAtom } from '../../state/Skills'
import { useAssetsMap } from '../../theme/utils'
import { StyledSkillpoint } from '../Common'

const DIM_FILTER = 'brightness(0.25) grayscale(1)'
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
    active: [currentlyActive]
  } = state

  const theme = useTheme()
  const { data: formattedUri } = useBuildMetadataImageUriQuery(metadata)

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

  const skillpointUri = useMemo((): string => {
    let uri: string | undefined
    if (!isEmptySkill) {
      uri = formattedUri
    } else {
      uri = _getValueFromDDPXImageMap(theme.assetsMap?.images?.skills?.skillpoint?.empty, 500, '1x')
    }

    return uri || SVG_LoadingCircleLight
  }, [formattedUri, isEmptySkill, theme.assetsMap?.images?.skills?.skillpoint?.empty])

  const emptySkillYOffset = useMemo(
    () => (isEmptySkill ? getSkillPlaceholderYOffsetPercentage() : undefined),
    [isEmptySkill]
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
          filter: ${isDimSkill ? DIM_FILTER : 'unset'};
        `}
      >
        <img
          src={skillpointUri}
          style={{ maxWidth: '100%', transform: isEmptySkill ? `scale(6) translateY(${emptySkillYOffset}%)` : 'unset' }}
        />
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

// when using the assetMap in theme...
export function getSkillPlaceholderYOffsetPercentage(parts = 4) {
  const idx = 17 * Math.floor(Math.random() * parts)
  return Math.floor(-42 + idx)
}

function _getValueFromDDPXImageMap(
  val: BackgroundPropertyFull | undefined,
  size: MediaWidths,
  ddpx: '1x' | '2x' | '3x' = '1x'
): string | undefined {
  return (val as GenericImageSrcSet<MediaWidths>)?.[size]?.[ddpx] || (val as string)
}
