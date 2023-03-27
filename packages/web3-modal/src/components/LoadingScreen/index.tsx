import { ArticleFadeIn, SpinnerCircle } from '@past3lle/components'
import { setCssBackground, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components'

interface LoadingContainerProps {
  backgroundColor?: string
  backgroundImg?: string
}
const LoadingContainerFadeIn = styled(ArticleFadeIn)<LoadingContainerProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};

  ${({ theme, backgroundColor, backgroundImg }) =>
    backgroundImg &&
    setCssBackground(theme, { imageUrls: [urlToSimpleGenericImageSrcSet(backgroundImg)], backgroundColor })}
`

interface SpinnerProps {
  src?: string | undefined
  size?: number | undefined
}

export interface LoadingScreenProps {
  containerProps?: LoadingContainerProps
  spinnerProps?: SpinnerProps
}

export function LoadingScreen({ containerProps, spinnerProps }: LoadingScreenProps) {
  return (
    <LoadingContainerFadeIn {...containerProps}>
      <SpinnerCircle {...spinnerProps} />
    </LoadingContainerFadeIn>
  )
}
