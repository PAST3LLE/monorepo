import { DOMAttributes, MutableRefObject } from 'react'
import { SpringConfig, useSprings } from 'react-spring'

/**
 * @name AxisDirection
 * @description Directional axis (X/Y) of scrolling behaviour
 */
export type AxisDirection = 'x' | 'y'
export type SizeOptions = {
  /**
   * @name fixedSize
   * @description pass in to ignore ref sizes (e.g parent ref size)
   * */
  fixedSize?: number
  /**
   * @name minSize
   * @description pass in to set as minimum size when using ref logic (e.g while getting parent ref size show this size instead of 0)
   * */
  minSize?: number
}

export interface OverwritingOptions {
  /**
   * @name sizeOptions
   * @description Sizes MUST be numbers
   */
  sizeOptions?: SizeOptions
  /**
   * @name styleMixin
   * @description Custom Spring animation mixin passed on every gesture. Can be overridden by gesture logic
   */
  styleMixin?: Record<string, any>
}

export interface InifniteScrollDataParams {
  itemSize: number
  dataLength: number
  setCurrentIndex: (i: number) => void
}

export interface InfiniteScrollHookOptions {
  /**
   * @name visible
   * @description First visible index
   */
  visible: number
  /**
   * @name scrollSpeed
   * @description Scrolling speed coefficient.
   * @description HIGHER number = SLOWER
   * @description LOWER number = higher (e.g 0.5 = 2x faster)
   */
  scrollSpeed?: number
  /**
   * @name snapOnScroll
   * @description Should item snap into view? WARNING: doesn't work super well with drag. Use useLimitedSwipe instead!
   */
  snapOnScroll?: boolean
  dynamicConfig?: boolean
  /**
   * @name scaleOptions
   * @description Options when using "scale" animation
   */
  scaleOptions: {
    /**
     * @name scaleOnScroll
     * @description Amount to scale item while scrolling
     */
    scaleOnScroll?: number
    /**
     * @name initialScale
     * @description Initial scale amount and amount will scale BACK TO, when using scaleOnScroll
     */
    initialScale: number
  }
  /**
   * @name config
   * @description Entire SpringConfig object
   */
  config?: SpringConfig | ((options: { configPos: number; length: number }) => SpringConfig)
}

export interface BaseGestureParams {
  currentIndex?: number
  axis: number
  dAxis: number
  mAxis?: number
  active: boolean
  first?: boolean
  last?: boolean
  down?: boolean
  memo?: { [key: number]: number }
  cancel: () => void
}

export interface WheelGestureParams extends BaseGestureParams {
  firstVis: number
  firstVisIdx: number
  prevRef: MutableRefObject<number[]>
}

export interface DragGestureParams extends BaseGestureParams {
  swDir: number
}

export type InfiniteScrollOptions = InfiniteScrollHookOptions & OverwritingOptions

export interface SpringAnimationHookReturn {
  target?: HTMLElement | null
  bind: (...args: any[]) => DOMAttributes<any>
  springs: ReturnType<typeof useSprings>[0]
  state: {
    currentIndex: number
    itemSize: number
    firstAnimationOver?: boolean
  }
  refCallbacks: {
    setScrollingZoneRef: (newNode: any) => void
    setItemSizeRef: (newNode: any) => void
  }
}
