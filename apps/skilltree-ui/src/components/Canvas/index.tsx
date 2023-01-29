import { CONFIG } from './api/config'
import { useLightningCanvas } from './api/hooks'
import { StyledCanvas } from './styleds'
import { useEffectRef } from '@past3lle/hooks'
import React from 'react'
import { useGetWindowSize } from 'state/WindowSize'

const CANVAS_ID = 'skilltree'

export function LightningCanvas() {
  const [setRef, ref] = useEffectRef<HTMLCanvasElement | null>(null)
  const canvasDOM = ref?.current

  const [{ width = 0 }] = useGetWindowSize()
  const height = (canvasDOM?.parentElement?.clientHeight || 0) - 92

  // run lightning canvas logic
  useLightningCanvas({ canvasDOM, dimensions: { width, height }, config: CONFIG })

  return <StyledCanvas id={CANVAS_ID} ref={setRef} width={width} height={height}></StyledCanvas>
}
