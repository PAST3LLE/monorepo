import { SpringConfig } from 'react-spring'

export const STIFF_SPRINGS: SpringConfig = {
  tension: 260,
  friction: 50
}

export const INTERPOLATED_SPRINGS = {
  catchUp: ({ length, configPos }: { length: number; configPos: number }) => ({
    tension: (1 + length - configPos) * 500,
    friction: 1 + configPos * 80
  })
}
