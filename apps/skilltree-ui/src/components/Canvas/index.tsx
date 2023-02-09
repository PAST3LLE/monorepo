import { CONFIG } from './api/config'
import { useLightningCanvas } from './api/hooks'
import { StyledCanvas } from './styleds'
import { useStateRef } from '@past3lle/hooks'
import React, { useMemo } from 'react'
import { useGetWindowSize } from 'state/WindowSize'

const CANVAS_ID = 'skilltree'

export function LightningCanvas({ useWindowWidth }: { useWindowWidth?: boolean }) {
  const [ref, setRef] = useStateRef<HTMLCanvasElement | null>(null, (node) => node)
  const canvasDOM = ref

  const [windowSize] = useGetWindowSize()
  const { width, height } = useMemo(() => {
    const height = canvasDOM?.parentElement?.clientHeight || 0
    const width = useWindowWidth ? window.innerWidth : canvasDOM?.parentElement?.clientWidth || 0
    return { height, width }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasDOM?.parentElement?.clientHeight,
    canvasDOM?.parentElement?.clientWidth,
    windowSize.height,
    windowSize.width,
  ])

  // run lightning canvas logic
  useLightningCanvas({
    canvasDOM,
    dimensions: { width, height },
    config: CONFIG,
  })

  return <StyledCanvas id={CANVAS_ID} ref={setRef} width={width} height={height}></StyledCanvas>
}
