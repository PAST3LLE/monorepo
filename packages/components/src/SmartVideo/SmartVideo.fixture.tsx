import React from 'react'

import { SmartVideo } from './index'

const container = document.createElement('div')
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
    />
  ),
  autoStop: (
    <SmartVideo
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
