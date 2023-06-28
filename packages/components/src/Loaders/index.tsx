import { SVG_LoadingCircleLight } from '@past3lle/assets'
import { rotateKeyframe } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components/macro'

export const Spinner = styled.img<{ size?: number; invertColor?: boolean }>`
  animation: 2s ${rotateKeyframe} linear infinite;
  width: ${({ size = 16 }) => size}px;
  height: ${({ size = 16 }) => size}px;

  filter: inverse(${({ invertColor }) => (invertColor ? 1 : 0)});
`

export const SpinnerCircle = ({
  size,
  src = SVG_LoadingCircleLight
}: {
  src?: string
  size?: number
  invertColor?: boolean
}) => <Spinner src={src} size={size} />
