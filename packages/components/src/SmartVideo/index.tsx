import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { useDetectScrollIntoView } from '@past3lle/hooks'
import { OFF_WHITE } from '@past3lle/theme'
import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Play } from 'react-feather'
import { BoxProps } from 'rebass'

import { Text as LayoutText } from '../Text'
import { useVideoAutoStop, useVideoError, useVideoLoaded } from './hooks'
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
  handleClick?: (...params: any[]) => void
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
    handleClick,
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
    autoPlayOptions,
    ctaOverlayProps,
    container,
    ...boxProps
  }: SmartVideoProps,
  forwardRef: ForwardedRef<HTMLVideoElement>
) {
  const [lastSourceElem, setLastSourceElem] = useState<HTMLSourceElement | null>(null)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  // forwardedRef in use, we need to assign our internal ref to the external
  useEffect(() => {
    if (forwardRef && videoElement) {
      typeof forwardRef === 'function' && forwardRef(videoElement)
    }
  }, [forwardRef, videoElement])

  // Video error listener
  const { error } = useVideoError(lastSourceElem)
  // Video load state listeners
  const { loading } = useVideoLoaded(videoElement)
  // Video auto stop listener
  useVideoAutoStop(videoElement, autoPlayOptions, handleClick)

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
      {showError || error ? (
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
      <img src={PNG_LogoCircle_2x} />
    </VideoPlayCTAOverlay>
  )
}

function VideoErrorOverlay(props: CTAOverlayProps & { errorMessage?: string }) {
  return (
    <VideoPlayCTAOverlay {...props} $height="100%" $width="120%">
      <VideoHeader letterSpacing={0} fontSize={20} padding="10rem" margin="0 15% 0 auto">
        <p>
          Error loading video! <span style={{ fontStyle: 'normal', fontWeight: 200, whiteSpace: 'pre' }}>ʕ ͡° ʖ̯ ͡°ʔ</span>
        </p>
        {props.errorMessage && <div>{props.errorMessage}</div>}
      </VideoHeader>
    </VideoPlayCTAOverlay>
  )
}
