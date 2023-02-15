import { CONFIG } from './api/config'
import { useLightningCanvas } from './api/hooks'
import { CanvasContainer, StyledCanvas } from './styleds'
import { SmartImg } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import React, { useMemo } from 'react'
import { calculateCanvasWidth } from 'state/Skills/updaters/GridPositionUpdater'
import { useGetWindowSize } from 'state/WindowSize'
import { BG_LOGO_DDPX_URL_MAP } from 'theme/global'

const CANVAS_ID = 'skilltree'

export function LightningCanvas() {
  const [ref, setRef] = useStateRef<HTMLCanvasElement | null>(null, (node) => node)
  const canvasDOM = ref

  const [windowSize] = useGetWindowSize()
  const { width, height } = useMemo(() => {
    const height = canvasDOM?.parentElement?.clientHeight || 0
    // const width = useWindowWidth ? window.innerWidth : canvasDOM?.parentElement?.clientWidth || 0
    const width = calculateCanvasWidth(document.body.clientWidth)
    return { height, width }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasDOM?.parentElement?.clientHeight,
    canvasDOM?.parentElement?.clientWidth,
    windowSize.height,
    // eslint-disable-next-line prettier/prettier
    windowSize.width
  ])

  // run lightning canvas logic
  useLightningCanvas({
    canvasDOM,
    dimensions: { width, height },
    config: CONFIG
  })

  return (
    <CanvasContainer>
      <StyledCanvas id={CANVAS_ID} ref={setRef} width={width} height={height}></StyledCanvas>
      <SmartImg
        path={{ defaultPath: BG_LOGO_DDPX_URL_MAP.defaultUrl }}
        pathSrcSet={BG_LOGO_DDPX_URL_MAP}
        style={{ position: 'absolute', bottom: 0, right: '10%', zIndex: 500 }}
      />
    </CanvasContainer>
  )
}
