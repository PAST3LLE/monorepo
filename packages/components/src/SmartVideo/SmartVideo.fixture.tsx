import { useStateRef } from '@past3lle/hooks'
import React, { useEffect, useState } from 'react'

import { SmartVideo, SmartVideoProps } from './index'

function SmartVideoWrapper(props: SmartVideoProps) {
  const [playing, setPlaying] = useState(true)
  const [ref, setRef] = useStateRef<HTMLVideoElement | null>(null, (node) => node)

  const showCtrlBtn = !props.autoPlayOptions || props.autoPlayOptions.stopTime < (ref?.currentTime || 0)

  useEffect(() => {
    if (!ref) return

    const isPlaying = playing
    if (isPlaying) {
      ref.play()
    } else {
      ref.pause()
    }
  }, [ref, playing])

  return (
    <>
      <button
        disabled={!showCtrlBtn}
        onClick={() => setPlaying((playing) => !playing)}
        style={{ padding: '1rem', margin: '1rem' }}
      >
        {playing ? 'POZ' : 'PLAY'}
      </button>

      <SmartVideo ref={setRef} {...props} handleClick={() => setPlaying((playing) => !playing)} />
    </>
  )
}

const container = typeof document !== undefined ? document.createElement('div') : undefined
export default {
  default: (
    <SmartVideo
      ctaOverlayProps={{ $zIndex: 1000 }}
      container={container}
      sourcesProps={[
        {
          src: 'https://cdn.shopify.com/videos/c/vp/a505bd49449b4e68baadbe9c5eb853a3/a505bd49449b4e68baadbe9c5eb853a3.SD-480p-0.9Mbps.mp4'
        }
      ]}
      forceLoad
    />
  ),
  showTapToPlay: (
    <SmartVideo
      ctaOverlayProps={{ $zIndex: 1000 }}
      container={container}
      sourcesProps={[
        {
          src: 'https://cdn.shopify.com/videos/c/vp/a505bd49449b4e68baadbe9c5eb853a3/a505bd49449b4e68baadbe9c5eb853a3.SD-480p-0.9Mbps.mp4'
        }
      ]}
      forceLoad
      showTapToPlay
      handleClick={() => alert('Video clicked')}
    />
  ),
  autoStop: (
    <SmartVideoWrapper
      ctaOverlayProps={{ $zIndex: 1000 }}
      container={container}
      sourcesProps={[
        {
          src: 'https://cdn.shopify.com/videos/c/vp/a505bd49449b4e68baadbe9c5eb853a3/a505bd49449b4e68baadbe9c5eb853a3.SD-480p-0.9Mbps.mp4'
        }
      ]}
      forceLoad
      autoPlayOptions={{
        stopTime: 2
      }}
    />
  )
}
