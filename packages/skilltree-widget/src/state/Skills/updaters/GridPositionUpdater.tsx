import { MEDIA_WIDTHS } from '@past3lle/theme'
import { useEffect, useMemo } from 'react'

import { SkillVectorsMap, useSkillsAtom } from '..'
import { calculateGridPoints } from '../../../components/SkillsCanvas/Canvas/api/hooks'
import {
  EMPTY_COLLECTION_ROWS_SIZE,
  MINIMUM_BOARD_WIDTH,
  MINIMUM_COLLECTION_BOARD_SIZE
} from '../../../constants/skills'
import { useMetadataReadAtom } from '../../../state/Metadata'
import { useGetWindowSize } from '../../../state/WindowSize'

export function GridPositionUpdater() {
  const [metadata] = useMetadataReadAtom()
  const [{ active, vectors }, setSkillState] = useSkillsAtom()
  const [windowSizeState] = useGetWindowSize()

  const gridConstants = useMemo(() => {
    const container = document.getElementById('CANVAS-CONTAINER')

    if (!container) return null

    const highestRowCount = !metadata?.[0]?.size
      ? EMPTY_COLLECTION_ROWS_SIZE
      : metadata.length === 1
      ? metadata[0].size
      : metadata.slice().sort((a, b) => b.size - a.size)[0].size
    const columns =
      metadata.length >= 1 ? Math.max(MINIMUM_COLLECTION_BOARD_SIZE, metadata.length) : MINIMUM_COLLECTION_BOARD_SIZE
    const rows = highestRowCount

    const gridHeight = container.clientHeight - 30
    const gridWidth = (MINIMUM_BOARD_WIDTH > container.clientWidth ? MINIMUM_BOARD_WIDTH : container.clientWidth) * 0.95

    // config
    const rowHeight = Math.round(gridHeight / rows)
    const columnWidth = Math.round(gridWidth / columns)

    return { rows, columns, rowHeight, columnWidth, gridHeight, gridWidth }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, windowSizeState.height, windowSizeState.width])

  useEffect(
    () => {
      if (gridConstants) {
        setSkillState((state) => ({
          ...state,
          vectors: calculateGridPoints(metadata, gridConstants)
        }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [windowSizeState.height, windowSizeState.width, active, metadata]
  )

  useEffect(() => {
    if (vectors.length > 0) {
      const vectorsMap = vectors.reduce((acc, next) => {
        const id = next.skillId
        if (id) {
          acc[id] = next
        }
        return acc
      }, {} as SkillVectorsMap)
      setSkillState((state) => ({ ...state, vectorsMap }))
    }
  }, [setSkillState, vectors])

  return null
}

export function calculateCanvasWidth(width: number) {
  if (width <= MEDIA_WIDTHS.upToSmall) {
    return MEDIA_WIDTHS.upToExtraSmall
  } else {
    return width
  }
}
