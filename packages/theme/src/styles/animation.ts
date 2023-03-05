import { transparentize } from 'polished'
import { DefaultTheme, FlattenInterpolation, Keyframes, ThemedStyledProps, css, keyframes } from 'styled-components'

/**
 * KEYFRAMES
 */

export const rotateImgKeyframe = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`
export const rotateKeyframe = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

/**
 * CSS ANIMATIONS
 */
export const bgPositionAnimation = css`
  @keyframes bgPositionAnimation {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`
export const contrastSaturateAndBlurAnimation = css`
  @keyframes contrastSaturateAndBlur {
    0% {
      filter: contrast(1.8) saturate(20) blur(0.5rem);
    }
    10% {
      filter: contrast(1.8) saturate(1) blur(0.8px);
    }
  }
`
export const rotate360Animation = css`
  @keyframes rotate360 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
export const strokeWidth = css`
  @keyframes strokeWidth {
    0% {
      stroke-width: 60.8;
    }
    10% {
      stroke-width: 0;
    }

    20% {
      stroke-width: 60.8;
    }

    50% {
      stroke-width: 0;
    }
    60% {
      stroke-width: 60.8;
    }

    90% {
      stroke-width: 0;
    }
    100% {
      stroke-width: 60.8;
    }
  }
`
const fadeInAnimation = css`
  @keyframes fadeIn {
    0% {
      filter: contrast(0) blur(100px);
    }
    100% {
      filter: contrast(1) blur(0px);
    }
  }
`
const flickerAnimation = css<{ frameBgColor?: string }>`
  @keyframes flickerIn {
    0% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(1, frameBgColor)};
    }
    5% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(0, frameBgColor)};
    }
    8% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(1, frameBgColor)};
    }
    9% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(0, frameBgColor)};
    }
    12% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(1, frameBgColor)};
    }
    18% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(0, frameBgColor)};
    }
    24% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(0, frameBgColor)};
    }
    28% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(1, frameBgColor)};
    }
    42% {
      background-color: ${({ frameBgColor = '#000' }) => transparentize(0, frameBgColor)};
    }
  }
`
export const textShadowAnimation = css<{ itemColor: string }>`
  @keyframes textShadowAnimation {
    0% {
      text-shadow: 2rem 0.2rem 0.2rem ${({ itemColor }) => itemColor};
      letter-spacing: 2rem;
    }
    3% {
      text-shadow: 5.5rem 0.2rem 0.8rem ${({ itemColor }) => itemColor};
    }
    5% {
      text-shadow: -22px 0.2rem 0.2rem pink;
    }
    7% {
      text-shadow: 4.7rem 0.2rem 0.8rem ${({ itemColor }) => itemColor};
    }
    10% {
      text-shadow: 1.7rem 0.2rem 0.8rem ${({ itemColor }) => itemColor};
    }
    47% {
      text-shadow: 1rem 0.2rem 0.2rem ${({ itemColor }) => itemColor};
      letter-spacing: 0.7rem;
    }
    48% {
      text-shadow: -2rem 0.2rem 0.1rem pink;
    }
    49% {
      text-shadow: 2rem 0.2rem 0.2rem ${({ itemColor }) => itemColor};
    }
    53% {
      text-shadow: 5.5rem 0.2rem 0.8rem ${({ itemColor }) => itemColor};
    }
    55% {
      text-shadow: -3.2rem 0.2rem 0.2rem purple;
    }
    57% {
      text-shadow: 4.7rem 0.2rem 0.7rem lightgreen;
    }
    58% {
      text-shadow: -4.7rem 0.2rem 0.1rem ${({ itemColor }) => itemColor};
    }
    60% {
      text-shadow: 2rem 0.2rem 0.2rem ${({ itemColor }) => itemColor};
    }
    65% {
      text-shadow: 2rem 0.2rem 0.5rem purple;
    }
  }
`

type AnimationName =
  | 'fadeIn'
  | 'flickerIn'
  | 'textShadowAnimation'
  | 'contrastSaturateAndBlur'
  | 'bgPositionAnimation'
  | 'strokeWidth'
  | 'rotate360'

interface BaseAnimationParams {
  name: AnimationName
  state?: boolean
  delay?: number
  count?: number | 'infinite'
  fillMode?: string
  duration: number
}

export function setAnimation<Props extends Record<any, any>>(
  animation: Keyframes,
  { state, delay, duration, count, fillMode }: Omit<BaseAnimationParams, 'name'>,
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined
export function setAnimation<Props extends Record<any, any>>(
  animation: FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>>,
  { name, state, delay, duration, count, fillMode }: BaseAnimationParams,
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined
export function setAnimation<Props extends Record<any, any>>(
  animation: Keyframes | FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>>,
  { name, state, delay, duration = 2, count = 1, fillMode }: Omit<BaseAnimationParams, 'name'> & { name?: string },
  customCss?: FlattenInterpolation<any>
): FlattenInterpolation<ThemedStyledProps<Props, DefaultTheme>> | undefined {
  if (!animation || state === false) return
  return css`
    ${animation}
    ${name && `animation-name: ${name};`}
    animation-duration: ${duration}s;
    animation-iteration-count: ${count};
    ${delay && `animation-delay: ${delay}s;`}
    ${fillMode && `animation-fill-mode: ${fillMode};`}
    
    ${customCss}
  `
}

export const setFadeInAnimation = (params?: Partial<Pick<BaseAnimationParams, 'duration'>>) =>
  setAnimation(fadeInAnimation, { name: 'fadeIn', duration: params?.duration || 0.8 })

type FlickerAnimationParams = Omit<BaseAnimationParams, 'name'> & { state: boolean }
export const setFlickerAnimation = ({ state, delay, duration, count }: FlickerAnimationParams) =>
  setAnimation(flickerAnimation, { state, name: 'flickerIn', delay, duration, count })
