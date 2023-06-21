import { SVG_LoadingCircleLight } from '@past3lle/assets'
import { RowCenter, RowProps, SmartImg } from '@past3lle/components'
import { SkillMetadata, SkillRarity, chainFetchIpfsUriBlob, getHash, useForgeGetIpfsAtom } from '@past3lle/forge-web3'
import { isImageKitUrl, isImageSrcSet } from '@past3lle/theme'
import { devError } from '@past3lle/utils'
import React, { memo, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Vector } from '../../api/vector'
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
  const [ipfsConfig] = useForgeGetIpfsAtom()
  const [state, setSkillState] = useForgesAtom()
  const {
    active: [currentlyActive],
    sizes: { height }
  } = state

  const [formattedUri, setImageBlob] = useState<string>()
  useEffect(() => {
    if (!metadata.image) return
    chainFetchIpfsUriBlob(getHash(metadata.image), ...ipfsConfig.gatewayUris)
      .then(setImageBlob)
      .catch((error) => {
        devError('[SkillForge-Widget::Skillpoint/index.tsx] Error in fetching IPFS Uri Blob!', error)
        setImageBlob(undefined)
      })
  }, [ipfsConfig.gatewayUris, metadata.image])

  const { isEmptySkill, isCurrentSkillActive, isDependency, isOtherSkillActive } = useMemo(
    () => ({
      isEmptySkill: (metadata.properties.id as `${string}-${string}`) === 'EMPTY-EMPTY',
      isCurrentSkillActive: !disabledHighlight && metadata.properties.id === currentlyActive,
      isDependency: state.activeDependencies.includes(metadata.properties.id),
      get isOtherSkillActive() {
        return !this.isDependency && !this.isCurrentSkillActive && !!currentlyActive
      }
    }),
    [currentlyActive, metadata.properties.id, state.activeDependencies, disabledHighlight]
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

  return (
    <StyledSkillpoint
      id={metadata.properties.id}
      title={`${metadata.name}_${metadata.properties.id}`}
      className={className}
      metadataCss={metadata?.attributes?.css}
      yOffset={emptySkillYOffset}
      rarity={forceRarity || (!isEmptySkill ? metadata.properties?.rarity : undefined)}
      dimSkill={!hasSkill || isOtherSkillActive}
      active={isCurrentSkillActive}
      isDependency={!!isDependency}
      isEmptySkill={isEmptySkill}
      vector={vector}
      onClick={handleClick}
      {...skillpointStyles}
    >
      <RowCenter height="100%" borderRadius="5px" overflow={'hidden'}>
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
