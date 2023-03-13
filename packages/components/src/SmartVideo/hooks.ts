import throttle from 'lodash.throttle'
import { useEffect, useState } from 'react'

import { SmartVideoProps } from '.'

type ThrottleFn = ReturnType<typeof throttle>
export function useVideoAutoStop(
  videoElement: HTMLVideoElement | null,
  autoPlayOptions: SmartVideoProps['autoPlayOptions'],
  callback?: () => void
) {
  // autoplay stop detection logic
  useEffect(() => {
    let video: HTMLVideoElement
    let _handler: ThrottleFn

    const stopTime = autoPlayOptions?.stopTime
    if (stopTime && stopTime > 0) {
      if (videoElement) {
        video = videoElement

        _handler = throttle(
          () => {
            if (videoElement?.currentTime) {
              videoElement.currentTime >= (stopTime || 0) && (callback?.() || videoElement.pause())
            }
          },
          600,
          { leading: true }
        )

        video.addEventListener('timeupdate', _handler)
      }
    }

    return () => {
      video?.removeEventListener('timeupdate', _handler)
    }
  }, [autoPlayOptions?.stopTime, videoElement, callback])
}

export function useVideoLoaded(videoElement: HTMLVideoElement | null) {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [metadataLoaded, setMetaDataLoaded] = useState(false)
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

  const loading = !metadataLoaded || !dataLoaded

  return {
    loading,
    dataLoaded,
    metadataLoaded
  }
}

export function useVideoError(lastSourceElem: HTMLSourceElement | null) {
  const [sourceErrored, setSourceErrored] = useState(false)

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

  return { error: sourceErrored }
}
