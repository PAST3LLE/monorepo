/* eslint-disable prefer-const */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffectRef } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import * as React from 'react'
import styled from 'styled-components'

import { useGetWindowSize } from '../../state/WindowSize'
import { CONFIG, LAYOUT_CONFIG } from './api/config'
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
  // z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0.4;
`

export function LightningCanvas() {
  const [ready, setReadyStatus] = React.useState(false)

  const [setRef, ref] = useEffectRef<HTMLCanvasElement | null>(null)
  const canvasRef = ref?.current

  const [{ width }] = useGetWindowSize()

  React.useEffect(() => {
    console.debug('WIDTH CHANGE DETECTED')
  }, [width])

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

    // when changes we remove listeners
    canvas.removeEventListener('mousedown', _onMouseDown, false)
    canvas.removeEventListener('mouseup', _onMouseUp, false)
    canvas.removeEventListener('mousemove', _onMouseMove)
    canvas.removeEventListener('touchstart', _onTouchStart, false)
    canvas.removeEventListener('touchend', _onTouchEnd, false)
    canvas.removeEventListener('touchmove', _onTouchMove)

    // add listeners
    canvas.addEventListener('mousedown', _onMouseDown, false)
    canvas.addEventListener('mouseup', _onMouseUp, false)
    canvas.addEventListener('mousemove', _onMouseMove)
    canvas.addEventListener('touchstart', _onTouchStart, false)
    canvas.addEventListener('touchend', _onTouchEnd, false)
    canvas.addEventListener('touchmove', _onTouchMove)

    // reset points array
    points = []

    // config
    const rowHeight = Math.round(canvas.height / LAYOUT_CONFIG.rows)
    const halfRow = Math.round(rowHeight / 2)
    const columnWidth = Math.round(canvas.width / LAYOUT_CONFIG.columns)
    const halfColumn = Math.round(columnWidth / 2)
    const xOffset = halfColumn

    // cache which row we're currently on
    let row = 1
    // loop while count is smaller than total cells (3col * 6row = 18)
    for (let i = 0; i < LAYOUT_CONFIG.columns * LAYOUT_CONFIG.rows; i++) {
      // e.g 3i % 3 === 0 means we are onto the next row
      if (i > 0 && i % LAYOUT_CONFIG.columns === 0) {
        // we have moved onto the next row, iterate variable
        row++
      }

      // e.g i = 2
      // 200cw * 2 = 400aw
      // 200cw + 400aw = 600aw
      // 600 - 100hc = 500
      const xAxis = columnWidth * (i % LAYOUT_CONFIG.columns) + xOffset
      const yAxis = (canvas.height / LAYOUT_CONFIG.rows) * row - halfRow
      const vector = new Vector(0, 0, xAxis, yAxis)

      points.push(vector)
    }
    console.debug('POINTS', points)

    _buildApi()

    window.requestAnimationFrame(_animate)
  }, [ready, width])

  // ========================
  // CLEARS CANVAS ON A TIMER
  // ========================
  React.useEffect(() => {
    let interval
    if (draw) {
      interval = setInterval(() => ctx?.clearRect(0, 0, canvas.width, canvas.height), 5000)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <StyledCanvas
      id={CANVAS_ID}
      ref={setRef}
      width={width}
      height={(canvasRef?.parentElement?.clientHeight || 0) - 92}
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
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (draw) {
    points.forEach((point) => {
      if (ctx) {
        // TODO: enable to see lightning sources
        // shouldn't be enabled in prod
        // ctx.fillRect(point.X1, point.Y1, 20, 20)
        // ctx.fillStyle = 'red'

        ltApi.Cast(ctx, point, target)
      }
    })
  } /* else {
    ctx.globalAlpha = 0.1
  } */

  setTimeout(() => {
    _animate()
  }, 60)
}

function _onMouseDown(e) {
  console.log('MOUSE-DOWN -- EVENT FIRED!')
  draw = true
  target = new Vector(
    0,
    0,
    e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
    e.clientY - canvas.offsetTop + document.documentElement.scrollTop
  )
}
function _onMouseUp(e) {
  console.log('MOUSE-UP -- EVENT FIRED!')
  draw = false
}
function _onMouseMove(e) {
  if (draw) {
    target = new Vector(
      0,
      0,
      e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
      e.clientY - canvas.offsetTop + document.documentElement.scrollTop
    )
  }
}
function _onTouchStart(e) {
  console.log('TOUCH-START -- EVENT FIRED!')
  draw = true
  target = new Vector(
    0,
    0,
    e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
    e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
  )
}
function _onTouchEnd(e) {
  console.log('TOUCH-END -- EVENT FIRED!')
  draw = false
}
function _onTouchMove(e) {
  if (draw) {
    target = new Vector(
      0,
      0,
      e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
      e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
    )
  }
}
