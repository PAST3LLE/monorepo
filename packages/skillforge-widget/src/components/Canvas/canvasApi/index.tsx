import { SmartImg } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import { useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import React, { useContext, useMemo } from 'react'

import { SkillForgeComponentContext } from '../../../components/Board'
import { MINIMUM_BOARD_HEIGHT } from '../../../constants/skills'
import { calculateCanvasWidth } from '../../../state/Skills/updaters/GridPositionUpdater'
import { useGenericImageSrcSet } from '../../../theme/global'
import { CONFIG } from './api/config'
import { useLightningCanvas } from './api/hooks'
import { CanvasContainer, StyledCanvas } from './styleds'

const CANVAS_ID = 'skillforge'

export function LightningCanvas() {
  const [ref, setRef] = useStateRef<HTMLCanvasElement | null>(null, (node) => node)
  const canvasDOM = ref

  const widgetWidth = useContext(SkillForgeComponentContext)

  const [windowSize] = useSkillForgeWindowSizeAtom()

  const { width, height } = useMemo(() => {
    const height = Math.max(canvasDOM?.parentElement?.clientHeight || 0, MINIMUM_BOARD_HEIGHT - 30)
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

  const { BG_LOGO_DDPX_URL_MAP } = useGenericImageSrcSet()

  return (
    <CanvasContainer>
      <StyledCanvas id={CANVAS_ID} ref={setRef} width={widgetWidth || width} height={height}></StyledCanvas>

      <SmartImg
        path={{ defaultPath: BG_LOGO_DDPX_URL_MAP.defaultUrl }}
        pathSrcSet={BG_LOGO_DDPX_URL_MAP}
        style={{ position: 'absolute', bottom: 0, right: '10%', zIndex: 500 }}
      />
    </CanvasContainer>
  )
}
