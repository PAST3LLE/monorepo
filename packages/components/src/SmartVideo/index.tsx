import { PNG } from '@past3lle/assets'
import { useDetectScrollIntoView } from '@past3lle/hooks'
import { OFF_WHITE, ThemeModes, getThemeColours } from '@past3lle/theme'
import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Play } from 'react-feather'
import { BoxProps } from 'rebass'

import { Text as LayoutText } from '../Text'
import { CTAOverlayProps, VideoContainer, VideoHeader, VideoPlayCTAOverlay } from './styleds'

type WithContainer = {
  container: HTMLElement | null | undefined
}

type AutoPlayOptions = {
  stopTime: number
}

export type SmartVideoProps = {
  sourcesProps: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>[]
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
  loadInView?: boolean
  forceLoad?: boolean
  showTapToPlay?: boolean
  showError?: boolean
  videoDelay?: boolean
  autoPlayOptions?: AutoPlayOptions
  ctaOverlayProps: CTAOverlayProps
  onResize?: React.VideoHTMLAttributes<HTMLVideoElement>['onResize'] | undefined
  onResizeCapture?: React.VideoHTMLAttributes<HTMLVideoElement>['onResizeCapture'] | undefined
} & WithContainer &
  BoxProps

const BASE_VIDEO_PROPS: Partial<
  React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
> = {
  loop: true,
  muted: true,
  autoPlay: true,
  preload: 'none',
  playsInline: true
}
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1,
  trackVisibility: true,
  delay: 300
}

/**
 * SmartVideo
 * @property sourcesProps: List of normal video source props e.g [
        {
          src: 'https://123/video.com',
          type: 'mp4'
        }
      ]
 * @property ctaOverlayProps: CSS props for video overlay, requires $zIndex
 * @property container: HTMLElement to bind video with, can be document.body
 */
export const SmartVideo = forwardRef(function LazyVideo(
  {
    sourcesProps,
    videoProps = {},
    // useful for setting when setup is animated
    // e.g useSprings animating components
    // and we dont want to check if in view before animation ends
    loadInView = true,
    forceLoad = false,
    showTapToPlay = false,
    videoDelay = false,
    showError = false,
    ctaOverlayProps,
    container,
    ...boxProps
  }: SmartVideoProps,
  forwardRef: ForwardedRef<HTMLVideoElement>
) {
  const [sourceErrored, setSourceErrored] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [metadataLoaded, setMetaDataLoaded] = useState(false)
  const loading = !metadataLoaded || !dataLoaded

  const [lastSourceElem, setLastSourceElem] = useState<HTMLSourceElement | null>(null)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // forwardedRef in use, we need to assign our internal ref to the external
  useEffect(() => {
    if (forwardRef && videoElement) {
      typeof forwardRef === 'function' && forwardRef(videoElement)
    }
  }, [forwardRef, videoElement])

  // capture LAST source error state
  useEffect(() => {
    const _handleSourceErrored = () => setSourceErrored(true)

    let source: HTMLSourceElement
    if (lastSourceElem) {
      source = lastSourceElem
      source.addEventListener('error', _handleSourceErrored)
    }

    return () => {
      source?.removeEventListener('error', _handleSourceErrored)
    }
  }, [lastSourceElem])

  // set VIDEO loading states for forwardRef
  useEffect(() => {
    const _handleDataLoad = () => {
      video?.removeEventListener('loadeddata', _handleDataLoad)
      setDataLoaded(true)
    }
    const _handleMetaDataLoad = () => {
      video?.removeEventListener('loadedmetadata', _handleMetaDataLoad)
      setMetaDataLoaded(true)
    }

    let video: HTMLVideoElement
    if (videoElement) {
      video = videoElement

      video.addEventListener('loadeddata', _handleDataLoad)
      video.addEventListener('loadedmetadata', _handleMetaDataLoad)
    }

    return () => {
      video?.removeEventListener('loadeddata', _handleDataLoad)
      video?.removeEventListener('loadedmetadata', _handleMetaDataLoad)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoElement])

  const isInView = useDetectScrollIntoView(
    loadInView ? videoElement : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      root: container
    },
    !loadInView
  )
  const combinedVideoProps = { ...BASE_VIDEO_PROPS, ...videoProps }
  const showDelayer = !showTapToPlay && (videoDelay || loading)
  return (
    <VideoContainer justifyContent="center" {...boxProps}>
      {/* 
      // TODO: reenable if in future loader/delayer should be different
      {loading ? <LoadingComponent /> : videoDelay ? <VideoDelayer /> : null} 
      */}
      {/* Show delayer comp whether delayed or is loading */}
      {showError || sourceErrored ? (
        <VideoErrorOverlay {...ctaOverlayProps} />
      ) : showDelayer ? (
        <VideoDelayer $zIndex={ctaOverlayProps.$zIndex} />
      ) : null}
      {showTapToPlay && (
        <VideoPlayCTAOverlay
          $width={ctaOverlayProps.$width || '120%'}
          left={-20}
          $height="100%"
          textAlign="center"
          $zIndex={ctaOverlayProps.$zIndex}
        >
          <LayoutText.SubHeader color={OFF_WHITE} display="flex" alignItems="center" justifyContent="center">
            <Play size="1.8rem" style={{ marginRight: '0.5rem' }} /> TAP TO PLAY
          </LayoutText.SubHeader>
        </VideoPlayCTAOverlay>
      )}
      <video {...combinedVideoProps} ref={setVideoElement}>
        {isInView || forceLoad
          ? sourcesProps.map(({ src, ...sourceProps }, index, arr) => {
              const isLast = index === arr.length - 1
              return <source key={src} src={src} ref={isLast ? setLastSourceElem : null} {...sourceProps} />
            })
          : null}
      </video>
    </VideoContainer>
  )
})

export function VideoDelayer(props: CTAOverlayProps) {
  return (
    <VideoPlayCTAOverlay {...props} $height="100%" $width="120%">
      <img src={PNG.LogoCircle_2x} />
    </VideoPlayCTAOverlay>
  )
}

function VideoErrorOverlay(props: CTAOverlayProps & { errorMessage?: string }) {
  return (
    <VideoPlayCTAOverlay {...props} bgColor={getThemeColours(ThemeModes.DARK).red3} $height="100%" $width="120%">
      <VideoHeader letterSpacing={0} fontSize={20} padding="10rem" margin="0 15% 0 auto">
        <p>
          Error loading video! <span style={{ fontStyle: 'normal', fontWeight: 200, whiteSpace: 'pre' }}>ʕ ͡° ʖ̯ ͡°ʔ</span>
        </p>
        {props.errorMessage && <div>{props.errorMessage}</div>}
      </VideoHeader>
    </VideoPlayCTAOverlay>
  )
}

export function Test() {
  return (
    <SmartVideo
      sourcesProps={[
        {
          src: '123',
          type: 'mp4'
        }
      ]}
      ctaOverlayProps={{ $zIndex: 1000 }}
      container={document.body}
    />
  )
}
