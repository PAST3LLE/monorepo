import { ForgeMetadataState, SkillId, SkillMetadata } from '@past3lle/forge-web3'
import { useEffect, useState } from 'react'

import { MARGINS } from '../../constants/grid'
import { SkillGridPositionList, SkillsState, VectorsState } from '../../state/Skills'
import { useAssetsMap } from '../../theme/utils'
import { Lightning } from '../lightning'
import { LightningConfig } from '../types'
import { Vector } from '../vector'

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
  points: { vector: Vector | undefined; skillId: SkillId | undefined }[] = []

export function useLightningCanvas({ canvasDOM, config, dimensions }: LightningCanvasProps) {
  const [ready, setReadyStatus] = useState(false)

  const assetsMap = useAssetsMap()

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

    const bgImage = new Image()
    if (assetsMap.images.background.app) {
      bgImage.src =
        typeof assetsMap.images.background.app === 'string'
          ? assetsMap.images.background.app
          : assetsMap.images.background.app?.defaultUrl
    }
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

    window.requestAnimationFrame(() => _animate(bgImage))
  }, [config, ready, height, width, canvasDOM?.parentElement, assetsMap.images.background.app])

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

function _animate(bgImage: HTMLImageElement) {
  if (!ctx) return

  // Clear board
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'
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
    _animate(bgImage)
  }, 480)
}

/* function depKeyIsObject(depKey: SkillProperties['dependencies'][0]): depKey is SkillDependencyObject {
  return Boolean(typeof depKey === 'object' && !!depKey?.collection && depKey?.required)
} */

/**
 * Offsets (moves) the lightning start source the same width as a single SkillSquare and half the height
 * @param state SkillsState
 * @returns Vector object with new location vectors
 */
const offsetLightningFromSkill = (vectorsState: VectorsState, skillsState: SkillsState) => (key: SkillId) => {
  const vectorMapAtKey = vectorsState.vectorsMap[key]

  return {
    ...vectorMapAtKey,
    vector: new Vector(
      0,
      0,
      (vectorMapAtKey?.vector?.X1 || 0) + skillsState.sizes.width,
      (vectorMapAtKey?.vector?.Y1 || 0) + skillsState.sizes.height / 2
    )
  }
}

/**
 * Toggling a skill triggers the lightning from the deps to the source (skill to be unlocked)
 * @param id SkillId - from metadata
 * @param state SkillsState
 */
export function toggleSelectedSkill(vectorsState?: VectorsState, skillsState?: SkillsState) {
  const selectedSkill = skillsState?.active ? vectorsState?.vectorsMap[skillsState.active[0]] : null
  if (!vectorsState || !skillsState || !selectedSkill?.vector) {
    draw = false
  } else {
    const depsList = skillsState?.activeDependencies || []
    points = depsList.map(offsetLightningFromSkill(vectorsState, skillsState))
    draw = true
    target = new Vector(
      0,
      0,
      selectedSkill.vector.X1 + skillsState.sizes.width,
      selectedSkill.vector.Y1 + skillsState.sizes.height / 2
    )
  }
}

const checkItemRowPosition = (i: number, columns: number) => i > 0 && i % columns === 0
/**
 * Calculates vector points of a grid by multiplying highest amount of rows by number of columns
 * @param metadata Skills metadata - aggregation of skills metadata in each collection
 * @param container HTMLElement containing the canvas
 * @returns Array (list) of Vectors each containing location Vector data for each square of the grid
 */
export function calculateGridPoints(
  metadata: ForgeMetadataState['metadata'][number],
  gridConstants: {
    rows: number
    columns: number
    columnWidth: number
    rowHeight: number
    gridHeight: number
  }
): SkillGridPositionList {
  const { rows, columnWidth, columns, rowHeight, gridHeight } = gridConstants

  // cache which row we're currently on
  let row = 1
  // loop while count is smaller than total cells (3col * 6row = 18)
  const points = []
  for (let i = 0; i < columns * rows; i++) {
    // e.g 3i % 3 === 0 means we are onto the next row
    const isNextRow = checkItemRowPosition(i, columns)
    if (isNextRow) {
      // we have moved onto the next row, iterate variable
      row++
    }

    const skillAtPosition: SkillMetadata | undefined = metadata?.[i % columns]?.[row - 1]

    const columnsEven = columns % 2 === 0
    const xAxis = Math.floor(
      columnWidth * (i % columns) +
        Math.max(MARGINS.SIDE, columnWidth / (columnsEven || columns <= 3 ? columns + 1 : columns))
    )
    const yAxis = Math.floor((gridHeight / rows) * (row + 0.2) - rowHeight)
    const vector: Vector | undefined = new Vector(0, 0, xAxis, yAxis)

    points.push({ vector, skillId: skillAtPosition?.properties?.id })
  }

  return points
}
