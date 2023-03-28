import { Z_INDICES } from '@past3lle/constants'
import { useIsMobile } from '@past3lle/hooks'
import { upToExtraSmall } from '@past3lle/theme'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'

const AnimatedDialogOverlay = animated(DialogOverlay)
interface ModalStyleProps {
  overlayBackgroundColor?: string
  zIndex?: number
  boxShadowColor?: string
  mainBackgroundColor?: string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)<Pick<ModalStyleProps, 'overlayBackgroundColor' | 'zIndex'>>`
  &[data-reach-dialog-overlay] {
    z-index: ${({ zIndex = Z_INDICES.MODALS }) => zIndex};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ overlayBackgroundColor = 'rgba(0,0,0,0.7)' }) => overlayBackgroundColor};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
const StyledDialogContent = styled(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ margin, minHeight, maxHeight, maxWidth, mobile, isOpen, isLargeImageModal, ...rest }) => (
    <AnimatedDialogContent {...rest} />
  )
).attrs({
  'aria-label': 'dialog'
})<Omit<ModalStyleProps, 'overlayBackgroundColor' | 'zIndex'>>`
  border: none;
  height: ${({ mobile }) => (mobile ? '100%' : '100%')};
  ${upToExtraSmall`
    height: 100%;
  `}

  &[data-reach-dialog-content] {
    outline: none;
    overflow: auto;

    background-color: ${({ mainBackgroundColor = 'transparent' }) => mainBackgroundColor};
    box-shadow: 0px 4px 8px 0px ${({ boxShadowColor = 'rgba(0,0,0,0.7)' }) => transparentize(0.95, boxShadowColor)};

    display: flex;
    align-self: center;

    border-radius: 0;
    margin: ${({ margin = '0 0 auto 0' }) => margin};
    padding-top: 2rem;
    width: ${({ isLargeImageModal }) => (isLargeImageModal ? '90' : '50')}vh;
    max-width: ${({ maxHeight, maxWidth = '42rem', isLargeImageModal = false }) =>
      `${isLargeImageModal ? maxHeight + 'vh' : maxWidth}`};
    ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight};`}
    ${({ minHeight }) => minHeight && `min-height: ${minHeight};`}
  }
`

export interface ModalProps {
  isLargeImageModal?: boolean
  isOpen: boolean
  onDismiss: () => void
  minHeight?: string
  maxHeight?: string
  maxWidth?: string
  margin?: string
  stopInputFocus?: boolean
  initialFocusRef?: React.RefObject<any>
  className?: string
  children?: React.ReactNode
  styleProps?: ModalStyleProps
}

export function Modal({
  isOpen,
  children,
  className,
  onDismiss,
  margin,
  minHeight,
  maxHeight = '90vh',
  maxWidth,
  stopInputFocus = true,
  styleProps = {},
  initialFocusRef,
  isLargeImageModal = false
}: ModalProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    return () => {
      onDismiss()
    }
  }, [onDismiss])

  if (!isOpen) return null

  return (
    <StyledDialogOverlay
      className={className}
      onDismiss={onDismiss}
      initialFocusRef={initialFocusRef}
      unstable_lockFocusAcrossFrames={false}
      {...styleProps}
    >
      <StyledDialogContent
        aria-label="dialog content"
        margin={margin}
        minHeight={minHeight}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        mobile={isMobile}
        isLargeImageModal={isLargeImageModal}
        {...styleProps}
      >
        {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
        {stopInputFocus && !initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
        {children}
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}
