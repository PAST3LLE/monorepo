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
  justify-content: center;
  align-items: center;
  gap: 1rem;

  height: 100%;
  width: 100%;

  > img {
    margin-top: 1em;
  }

  > ${ModalTitleText} {
    font-weight: 300;
    font-variation-settings: 'wght' 400;
    letter-spacing: -4px;
  }

  background-color: ${({ backgroundColor = 'transparent' }) => backgroundColor};
  border-radius: ${({ borderRadius = '0px' }) => borderRadius};

  ${({ theme, backgroundColor, backgroundImg }) =>
    backgroundImg &&
    (backgroundImg !== 'unset' || backgroundImg !== ('none' as string)) &&
    setCssBackground(theme, { imageUrls: [urlToSimpleGenericImageSrcSet(backgroundImg)], backgroundColor })}
`

export interface SpinnerProps {
  /**
   * @name src
   * @description source URL
   */
  src?: string | undefined
  /**
   * @name size
   * @description Number size of spinner (in px)
   * @default 20
   */
  size?: number | undefined
  /**
   * @name stroke
   * @description Stroke colour
   * @default "#D9EAFF"
   */
  stroke?: string | undefined
  /**
   * @name strokeWidth
   * @description Number size of spinner svg stroke width (in px)
   * @default 0.25
   */
  strokeWidth?: number | undefined
  /**
   * @name filter
   * @description String. CSS filter.
   * @default "unset"
   */
  filter?: string
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
   * @name fontSize
   * @description font size for (any) loading text. string e.g 20rem // 10px
   */
  fontSize?: string
  /**
   * @name loadingText
   * @description Optional. String label to show on load.
   * @default "QUERYING INFO..."
   */
  loadingText?: string
}

export function LoadingScreen({
  containerProps,
  spinnerProps,
  fontSize = '1.5em',
  loadingText = 'QUERYING INFO...'
}: LoadingScreenProps) {
  return (
    <LoadingContainerFadeIn {...containerProps}>
      <ModalTitleText fontSize={fontSize} fvs={{ wght: 100 }}>
        {loadingText}
      </ModalTitleText>
      <SpinnerCircle {...spinnerProps} />
    </LoadingContainerFadeIn>
  )
}
