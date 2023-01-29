import BG_IMAGE from '../../../../assets/png/background.png'
import { LAYOUT_CONFIG } from '../config'
import { Lightning } from '../lightning'
import { LightningConfig } from '../types'
import { Vector } from '../vector'
import { useEffect, useState } from 'react'

interface LightningCanvasProps {
  canvasDOM: HTMLCanvasElement | null | undefined
  dimensions: { width: number; height: number }
  config: LightningConfig
}

let canvas: HTMLCanvasElement,
  target: Vector,
  ctx: CanvasRenderingContext2D | null,
  ltApi: Lightning,
  draw: boolean,
  points: Vector[] = []

export function useLightningCanvas({ canvasDOM, config, dimensions }: LightningCanvasProps) {
  const [ready, setReadyStatus] = useState(false)

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    if (canvasDOM && !ready) {
      canvas = canvasDOM
      ctx = canvas.getContext('2d')

      setReadyStatus(true)
    }
  }, [canvasDOM, ready])

  // use as a dep
  const { width, height } = dimensions
  useEffect(() => {
    if (!canvas || !ready) return

    // when changes we remove listeners
    canvas.removeEventListener('mousedown', _onMouseDown, true)
    canvas.removeEventListener('mouseup', _onMouseUp, true)
    canvas.removeEventListener('mousemove', _onMouseMove)
    canvas.removeEventListener('touchstart', _onTouchStart, true)
    canvas.removeEventListener('touchend', _onTouchEnd, true)
    canvas.removeEventListener('touchmove', _onTouchMove)

    // add listeners
    canvas.addEventListener('mousedown', _onMouseDown, { passive: true })
    canvas.addEventListener('mouseup', _onMouseUp, { passive: true })
    canvas.addEventListener('mousemove', _onMouseMove, { passive: true })
    canvas.addEventListener('touchstart', _onTouchStart, { passive: true })
    canvas.addEventListener('touchend', _onTouchEnd, { passive: true })
    canvas.addEventListener('touchmove', _onTouchMove, { passive: true })

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

    _buildApi(config)

    window.requestAnimationFrame(_animate)
  }, [config, ready, height, width])

  // ========================
  // CLEARS CANVAS ON A TIMER
  // ========================
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined
    if (draw) {
      interval = setInterval(() => ctx?.clearRect(0, 0, canvas.width, canvas.height), 5000)
    } else {
      interval && clearInterval(interval)
    }

    return () => {
      interval && clearInterval(interval)
    }
  }, [])
}

function _buildApi(config: LightningConfig) {
  ltApi = new Lightning(config)
}
const bgImage = new Image()
bgImage.src = BG_IMAGE
function _animate() {
  if (!ctx) return

  // Clear board
  ctx.shadowBlur = 0
  ctx.shadowColor = ''
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)

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

function _onMouseDown(e: MouseEvent) {
  draw = true
  target = new Vector(
    0,
    0,
    e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
    e.clientY - canvas.offsetTop + document.documentElement.scrollTop
  )
}
function _onMouseUp() {
  draw = false
}
function _onMouseMove(e: MouseEvent) {
  if (draw) {
    target = new Vector(
      0,
      0,
      e.clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
      e.clientY - canvas.offsetTop + document.documentElement.scrollTop
    )
  }
}
function _onTouchStart(e: TouchEvent) {
  draw = true
  target = new Vector(
    0,
    0,
    e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
    e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
  )
}
function _onTouchEnd() {
  draw = false
}
function _onTouchMove(e: TouchEvent) {
  if (draw) {
    target = new Vector(
      0,
      0,
      e.touches[0].clientX - canvas.offsetLeft + document.documentElement.scrollLeft,
      e.touches[0].clientY - canvas.offsetTop + document.documentElement.scrollTop
    )
  }
}
