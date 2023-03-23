import { DragState, PinchState } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { MutableRefObject, SetStateAction } from 'react'
import { SpringConfig, SpringRef } from 'react-spring'

import { AxisDirection, InfiniteScrollHookOptions, InifniteScrollDataParams, WheelGestureParams } from '../types'

/**
 *
 * @param a input
 * @param b constraint 1 (can be low or high)
 * @param c constraint 2 (can be low or high)
 * @returns number closer to b or c
 */
const _closerTo = (a: number, b: number, c: number) => (Math.abs(c - a) >= Math.abs(b - a) ? b : c)
function _getLimits(point: number, mult: number): number[] {
  const range = point / mult
  const highPoint = mult * Math.ceil(range)
  const bounds = [highPoint - mult, highPoint]

  return bounds
}
function _calcAnchorPos(point: number, mult: number) {
  const [limitA, limitB] = _getLimits(point, mult)

  return _closerTo(point, limitA, limitB)
}

export function getNearestAxisPoint(point: number, multiple: number) {
  const anchorPoint = _calcAnchorPos(point, multiple)

  return anchorPoint
}

export const getIndex = (axis: number, l: number) => (axis < 0 ? axis + l : axis) % l
export const getPos = (i: number, firstVisible: number, firstVisibleIndex: number, length: number) =>
  getIndex(i - firstVisible + firstVisibleIndex, length)

export const calculateInfiniteScrollApiLogic: (
  i: number,
  axisDirection: AxisDirection,
  {
    prevRef,
    active,
    last,
    axis,
    dAxis,
    mAxis,
    firstVis,
    firstVisIdx,
    scaleOptions,
    snapOnScroll,
    config,
    dataLength,
    itemSize,
    setCurrentIndex
  }: Omit<InfiniteScrollHookOptions, 'visible'> & Omit<WheelGestureParams, 'cancel'> & InifniteScrollDataParams
) => {
  [x: string]: number | boolean | SpringConfig | undefined
  scale: number
  immediate: boolean
  config: SpringConfig | undefined
} = (
  i: number,
  axisDirection: AxisDirection,
  {
    prevRef,
    active,
    last,
    axis,
    dAxis,
    mAxis,
    firstVis,
    firstVisIdx,
    scaleOptions,
    snapOnScroll,
    config,
    dataLength,
    itemSize,
    setCurrentIndex
  }
) => {
  const position = getPos(i, firstVis, firstVisIdx, dataLength)
  const prevPosition = getPos(i, prevRef.current[0], prevRef.current[1], dataLength)
  const rank = firstVis - (axis < 0 ? dataLength : 0) + position - firstVisIdx
  // const configPos = dAxis > 0 ? position : dataLength - position

  const scale =
    mAxis && scaleOptions?.scaleOnScroll && active
      ? Math.max(1 - Math.abs(mAxis) / itemSize / 2, scaleOptions.scaleOnScroll)
      : scaleOptions.initialScale

  const axisPos = (-axis % (itemSize * dataLength)) + itemSize * rank
  const anchorPoint = last && getNearestAxisPoint(axisPos, itemSize)
  const onScreen = anchorPoint === 0

  // the frame at the 0 anchor point is the current one in frame
  // set it as the current index - sets header, nav, etc
  if (onScreen) {
    setCurrentIndex(i)
  }

  const configPos = dAxis > 0 ? position : dataLength - position
  const immediate = dAxis < 0 ? prevPosition > position : prevPosition < position

  return {
    [axisDirection]: !active && snapOnScroll ? anchorPoint || undefined : axisPos,
    scale,
    immediate,
    config: typeof config === 'function' ? config({ configPos, length: dataLength }) : config
  }
}
type RunSpringsParams<T> = Omit<T, 'firstVis' | 'firstVisIdx'> & InfiniteScrollHookOptions & InifniteScrollDataParams
export function runInfiniteScrollSprings<T extends Record<any, any>>(
  api: SpringRef<T>,
  axisDirection: AxisDirection,
  { dataLength, itemSize, axis, dAxis, visible, prevRef, ...rest }: RunSpringsParams<Omit<WheelGestureParams, 'cancel'>>
) {
  const itemPosition = Math.floor(axis / itemSize) % dataLength
  const firstVis = getIndex(itemPosition, dataLength)
  const firstVisIdx = dAxis < 0 ? dataLength - visible - 1 : 1

  api.start((i) =>
    calculateInfiniteScrollApiLogic(i, axisDirection, {
      axis,
      dAxis,
      firstVis,
      firstVisIdx,
      itemSize,
      dataLength,
      prevRef,
      ...rest
    })
  )

  prevRef.current = [firstVis, firstVisIdx]
}

type GestureIndexOptions = {
  current: MutableRefObject<number>
  last: number
  setIndex?: React.Dispatch<SetStateAction<number>>
}

type DragLogicOptions = {
  indexOptions: GestureIndexOptions
  itemSize: number
  axis: AxisDirection
}

const runLimitedSwipe =
  ([, api]: any[], { axis: axisDirection, indexOptions, itemSize }: DragLogicOptions) =>
  ({ active, movement, direction, cancel }: DragState) => {
    const axis = axisDirection === 'x' ? 0 : 1
    const [mAxis, gestDir] = [movement[axis], direction[axis]]
    if (gestDir) {
      const { current, last: lastIndx, setIndex } = indexOptions

      const bounds: [number, number] = [
        current.current - 1 > 0 ? current.current - 1 : 0,
        current.current + 1 < lastIndx ? current.current + 1 : lastIndx
      ]

      if (active && Math.abs(mAxis) > itemSize / 10) {
        const clampedIdx = clamp(current.current + -gestDir, ...bounds)
        current.current = clampedIdx
        cancel?.()
        setIndex?.(clampedIdx)
      }

      api.start((i: number) => {
        if (i < current.current - 1 || i > current.current + 1) return { display: 'none' }
        const axisPoint = (i - current.current) * itemSize + (active ? mAxis : 0)
        return { [axisDirection]: axisPoint, display: 'block' }
      })
    }
  }

type PinchLogicOptions = {
  ref?: HTMLElement | null
}

const runPinchZoom =
  ([springs, api]: any[], { ref }: PinchLogicOptions) =>
  ({ args: [index], origin: [ox, oy], first, movement: [ms], offset: [s], memo }: PinchState) => {
    if (first) {
      memo = {}
      const refSizes = ref?.getBoundingClientRect()

      const tx = ox - (ox + (refSizes?.width || 0) / 2)
      const ty = oy - (oy + (refSizes?.height || 0) / 2)

      memo[index.toString()] = [springs[index].x.get(), springs[index].y.get(), tx, ty]
    }

    const x = memo[index.toString()][0] - (ms - 1) * memo[index.toString()][2]
    const y = memo[index.toString()][1] - (ms - 1) * memo[index.toString()][3]

    api.start(() => ({ scale: s, x, y }))

    return memo
  }

export default {
  wheel: {
    infinite: runInfiniteScrollSprings
  },
  drag: {
    infinite: runInfiniteScrollSprings,
    limited: runLimitedSwipe
  },
  pinch: {
    zoom: runPinchZoom
  }
}
