import { proxy } from 'valtio'

import { WindowSizes } from '.'

export const state = proxy({
  width: 0,
  height: 0,
  ar: 0
})

export const setDimensions = ({ width, height, ar }: WindowSizes) => {
  state.width = width || 0
  state.height = height || 0
  state.ar = ar || 0
}
