import { SmartImg } from '@past3lle/components'
import { useForgeUserConfigAtom, useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { useStateRef } from '@past3lle/hooks'
import React, { useContext, useEffect, useState } from 'react'

import { CONFIG } from '../../../api/config'
import { useLightningCanvas } from '../../../api/hooks'
import { calculateCanvasWidth } from '../../../state/Skills/updaters/GridPositionUpdater'
import { useGenericImageSrcSet } from '../../../theme/global'
import { SkillForgeComponentContext } from '../../Board'
import { CanvasContainer, StyledCanvas } from './styleds'

const CANVAS_ID = 'skillforge'

export function LightningCanvas() {
  const [ref, setRef] = useStateRef<HTMLCanvasElement | null>(null, (node) => node)
  const canvasDOM = ref

  const widgetWidth = useContext(SkillForgeComponentContext)

  const [windowSize] = useForgeWindowSizeAtom()
  const [
    {
      board: { minimumBoardHeight: MINIMUM_BOARD_HEIGHT }
    }
  ] = useForgeUserConfigAtom()

  const [{ width, height }, setCanvasDimensions] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (typeof document === undefined) return
    const height = Math.max(canvasDOM?.parentElement?.clientHeight || 0, MINIMUM_BOARD_HEIGHT - 30)
    const width = widgetWidth || calculateCanvasWidth(document.body.clientWidth)

    setCanvasDimensions({ height, width })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    widgetWidth,
    canvasDOM?.parentElement?.clientHeight,
    canvasDOM?.parentElement?.clientWidth,
    windowSize.height,
    windowSize.width
  ])

  // run lightning canvas logic
  useLightningCanvas({
    canvasDOM,
    dimensions: { width, height },
    config: CONFIG
  })

  const { BG_LOGO_DDPX_URL_MAP } = useGenericImageSrcSet()

  if (!BG_LOGO_DDPX_URL_MAP) return null

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
