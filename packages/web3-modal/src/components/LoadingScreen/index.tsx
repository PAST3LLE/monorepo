import { ArticleFadeIn, SpinnerCircle } from '@past3lle/components'
import { setCssBackground, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components'

import { ModalTitleText } from '../modals/common/styled'

interface LoadingContainerProps {
  /**
   * @description Container bg colour
   */
  backgroundColor?: string
  /**
   * @description Container bg img url (override backgroundColor)
   */
  backgroundImg?: string
  /**
   * @description Container border radius
   */
  borderRadius?: string
}
const LoadingContainerFadeIn = styled(ArticleFadeIn)<LoadingContainerProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: center;
  height: 100%;
  width: 100%;

  > img {
    margin-top: 1em;
  }

  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};

  border-radius: ${({ borderRadius = '0px' }) => borderRadius};

  ${({ theme, backgroundColor, backgroundImg }) =>
    backgroundImg &&
    setCssBackground(theme, { imageUrls: [urlToSimpleGenericImageSrcSet(backgroundImg)], backgroundColor })}
`

interface SpinnerProps {
  /**
   * @name src
   * @description source URL
   */
  src?: string | undefined
  /**
   * @name suze
   * @description Number size of spinner (in px)
   * @default 20
   */
  size?: number | undefined
  /**
   * @name invertColor
   * @description Boolean. Inverts color of spinner
   * @default false
   */
  invertColor?: boolean
}

export interface LoadingScreenProps {
  /**
   * @name containerProps
   * @description Optional. Spinner container style props.
   */
  containerProps?: LoadingContainerProps
  /**
   * @name spinnerProps
   * @description Async spinner props: src, size, invertColor
   */
  spinnerProps?: SpinnerProps
  /**
   * @name loadingText
   * @description Optional. String label to show on load.
   * @default "QUERYING INFO..."
   */
  loadingText?: string
}

export function LoadingScreen({ containerProps, spinnerProps, loadingText = 'QUERYING INFO...' }: LoadingScreenProps) {
  return (
    <LoadingContainerFadeIn {...containerProps}>
      <ModalTitleText
        fontSize="1.5em"
        marginTop="2em"
        fvs={{
          wght: 100
        }}
      >
        {loadingText}
      </ModalTitleText>
      <SpinnerCircle {...spinnerProps} />
    </LoadingContainerFadeIn>
  )
}
