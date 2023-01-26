/* eslint-disable prefer-const */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffectRef } from '@past3lle/hooks'
import * as React from 'react'
import styled from 'styled-components'

import { CONFIG } from './api/config'
import { Lightning } from './api/lightning'
import { Vector } from './api/vector'

const CANVAS_ID = 'skilltree'
let canvas: HTMLCanvasElement,
  target: Vector,
  ctx: CanvasRenderingContext2D | null,
  ltApi: Lightning,
  draw: boolean,
  points: Vector[] = []

const StyledCanvas = styled.canvas`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
`

export function LightningCanvas() {
  const [ready, setReadyStatus] = React.useState(false)

  const [setRef, ref] = useEffectRef<HTMLCanvasElement | null>(null)
  const canvasRef = ref?.current

  // ===========================
  // EFFECTS
  // ===========================
  React.useEffect(() => {
    if (canvasRef && !ready) {
      canvas = canvasRef
      ctx = canvas.getContext('2d')

      setReadyStatus(true)
    }
  }, [canvasRef, ready])

  React.useEffect(() => {
    if (!canvas || !ready) return

    canvas.addEventListener(
      'mousedown',
      (e) => {
        console.log('MOUSE-DOWN -- EVENT FIRED!')
        draw = true
        target = new Vector(
          0,
          0,
          e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
          e.clientY - canvas.offsetTop + document.documentElement.scrollTop
        )
      },
      false
    )

    canvas.addEventListener(
      'mouseup',
      (e) => {
        console.log('MOUSE-UP -- EVENT FIRED!')
        draw = false
      },
      false
    )

    canvas.addEventListener('mousemove', (e) => {
      if (draw) {
        target = new Vector(
          0,
          0,
          e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
          e.clientY - canvas.offsetTop + document.documentElement.scrollTop
        )
      }
    })

    canvas.addEventListener(
      'touchstart',
      (e) => {
        console.log('TOUCH-START -- EVENT FIRED!')
        draw = true
        target = new Vector(
          0,
          0,
          e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
          e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
        )
      },
      false
    )

    canvas.addEventListener(
      'touchend',
      (e) => {
        console.log('TOUCH-END -- EVENT FIRED!')
        draw = false
      },
      false
    )

    canvas.addEventListener('touchmove', (e) => {
      if (draw) {
        target = new Vector(
          0,
          0,
          e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
          e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
        )
      }
    })

    //Lighning sources
    points.push(new Vector(0, 0, canvas.width / 2, canvas.height / 2))
    points.push(new Vector(0, 0, 20, 20))
    points.push(new Vector(0, 0, canvas.width / 2, 20))
    points.push(new Vector(0, 0, canvas.width - 20, 20))
    points.push(new Vector(0, 0, 20, canvas.height - 20))
    points.push(new Vector(0, 0, canvas.width / 2, canvas.height - 20))
    points.push(new Vector(0, 0, canvas.width - 20, canvas.height - 20))

    _buildApi()

    window.requestAnimationFrame(_animate)
  }, [ready])

  return (
    <StyledCanvas
      id={CANVAS_ID}
      ref={setRef}
      width={canvasRef?.parentElement?.clientWidth}
      height={canvasRef?.parentElement?.clientHeight}
    ></StyledCanvas>
  )
}

function _buildApi() {
  let opt = CONFIG

  ltApi = new Lightning(opt)
}

function _animate() {
  if (!ctx) return

  // Clear board
  ctx.shadowBlur = 0
  ctx.shadowColor = ''
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (draw) {
    points.forEach((p) => {
      ctx && ltApi.Cast(ctx, p, target)
    })
  }

  setTimeout(() => {
    _animate()
  }, 60)
}
