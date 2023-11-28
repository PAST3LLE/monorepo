import { CircleOutline, SVG_LoadingCircleLight } from '@past3lle/assets'
import { rotateKeyframe } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components'

type SpinnerProps = {
  src?: string
  size?: number
  filter?: string
}

export const Spinner = styled.img<Omit<SpinnerProps, 'src'>>`
  animation: 2s ${rotateKeyframe} linear infinite;
  width: ${({ size = 16 }) => size}px;
  height: ${({ size = 16 }) => size}px;

  filter: ${({ filter = 'unset' }) => filter};
`

export const StyledCircleOutline = styled(CircleOutline)<Omit<SpinnerProps, 'src'>>`
  animation: 2s ${rotateKeyframe} linear infinite;
  filter: ${({ filter = 'unset' }) => filter};
`

export const SpinnerWithSrc = ({ size, src = SVG_LoadingCircleLight, filter }: SpinnerProps) => (
  <Spinner src={src} size={size} filter={filter} />
)

export const SpinnerCircle = (
  props: Omit<SpinnerProps, 'src'> & { stroke?: string; strokeWidth?: number } = {
    filter: 'none',
    size: 22,
    stroke: 'pink',
    strokeWidth: 0.25
  }
) => <StyledCircleOutline {...props} />
