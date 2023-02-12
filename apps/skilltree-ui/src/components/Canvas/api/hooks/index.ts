import { Lightning } from '../lightning'
import { LightningConfig } from '../types'
import { Vector } from '../vector'
import BG_IMAGE from 'assets/png/background.png'
import { SkillId, SkillMetadata } from 'components/Skills/types'
import { useEffect, useState } from 'react'
import { SkillGridPositionList, SkillsState } from 'state/Skills'

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
  points: { vector: Vector | undefined; skill: SkillMetadata | undefined }[] = []

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
    if (!canvas || !ready || !canvasDOM?.parentElement) return

    /* Uncomment for event listening
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
    */

    _buildApi(config)

    window.requestAnimationFrame(_animate)
  }, [config, ready, height, width, canvasDOM?.parentElement])

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
    points.forEach(({ vector: point }) => {
      if (ctx && point) {
        ltApi.Cast(ctx, point, target)
      }
    })
  }

  setTimeout(() => {
    _animate()
  }, 60)
}

/**
 * Offsets (moves) the lightning start source the same width as a single SkillSquare and half the height
 * @param state SkillsState
 * @returns Vector object with new location vectors
 */
const offsetLightningFromSkill = (state: SkillsState) => (key: SkillId) => {
  const currentSkillState = state.vectorsMap[key]

  return {
    ...currentSkillState,
    vector: new Vector(
      0,
      0,
      (currentSkillState.vector?.X1 || 0) + state.sizes.width,
      (currentSkillState.vector?.Y1 || 0) + state.sizes.height / 2
    )
  }
}

/**
 * Toggling a skill triggers the lightning from the deps to the source (skill to be unlocked)
 * @param id SkillId - from metadata
 * @param state SkillsState
 */
export function toggleSelectedSkill(state?: SkillsState) {
  const selectedSkill = state?.active ? state?.vectorsMap[state.active] : null
  if (!state || !selectedSkill?.vector) {
    draw = false
  } else {
    points = (state.activeDependencies || []).map(offsetLightningFromSkill(state))
    draw = true
    target = new Vector(0, 0, selectedSkill.vector.X1, selectedSkill.vector.Y1)
  }
}

/* Uncomment for eventListening
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
*/

/**
 * Calculates vector points of a grid by multiplying highest amount of rows by number of columns
 * @param metadata Skills metadata - aggregation of skills metadata in each collection
 * @param container HTMLElement containing the canvas
 * @returns Array (list) of Vectors each containing location Vector data for each square of the grid
 */
export function calculateGridPoints(
  metadata: SkillMetadata[][],
  container: Pick<HTMLElement, 'clientHeight' | 'clientWidth'>
): SkillGridPositionList {
  const highestRowCount = metadata.slice().sort((a, b) => b.length - a.length)[0].length
  const columns = metadata.length
  const rows = highestRowCount

  const gridHeight = container.clientHeight - 30
  const gridWidth = container.clientWidth

  // config
  const rowHeight = Math.round(gridHeight / rows)
  const columnWidth = Math.round(gridWidth / columns)

  // cache which row we're currently on
  let row = 1
  // loop while count is smaller than total cells (3col * 6row = 18)
  const points = []
  for (let i = 0; i < columns * rows; i++) {
    // e.g 3i % 3 === 0 means we are onto the next row
    if (i > 0 && i % columns === 0) {
      // we have moved onto the next row, iterate variable
      row++
    }

    const skillAtPosition = metadata[i % columns][row - 1]

    // e.g i = 2
    // 200cw * 2 = 400aw
    // 200cw + 400aw = 600aw
    // 600 - 100hc = 500
    const xAxis = Math.floor(columnWidth * (i % columns) + columnWidth / columns)
    const yAxis = Math.floor((gridHeight / rows) * (row + 0.2) - rowHeight)
    const vector: Vector | undefined = !!skillAtPosition ? new Vector(0, 0, xAxis, yAxis) : undefined

    points.push({ vector, skill: skillAtPosition })
  }

  return points
}
