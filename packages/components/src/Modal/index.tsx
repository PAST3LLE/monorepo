import { Z_INDICES } from '@past3lle/constants'
import { upToExtraSmall } from '@past3lle/theme'
import { isMobile } from '@past3lle/utils'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: ${Z_INDICES.MODALS};
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

    background-color: ${({ theme }) => theme.blackOpaque1};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, isLargeImageModal, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  border: none;
  height: ${({ mobile }) => (mobile ? '100%' : '100%')};
  ${upToExtraSmall`
    height: 100%;
  `}

  &[data-reach-dialog-content] {
    outline: none;
    overflow: auto;

    background-color: ${({ theme }) => theme.bg0};
    box-shadow: 0px 4px 8px 0px ${({ theme }) => transparentize(0.95, theme.shadow1)};

    display: flex;
    align-self: center;

    border-radius: 0;
    margin: 0 0 auto 0;
    padding-top: 2rem;
    width: ${({ isLargeImageModal }) => (isLargeImageModal ? '90' : '50')}vh;
    max-width: ${({ maxHeight, isLargeImageModal = false }) => `${isLargeImageModal ? maxHeight + 'vh' : '42rem'}`};
    ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight}vh;`}
    ${({ minHeight }) => minHeight && `min-height: ${minHeight}vh;`}
  }
`

interface ModalProps {
  isLargeImageModal?: boolean
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  className?: string
  children?: React.ReactNode
}

export function Modal({
  isLargeImageModal = false,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  isOpen,
  className,
  children
}: ModalProps) {
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
    >
      <StyledDialogContent
        aria-label="dialog content"
        minHeight={minHeight}
        maxHeight={maxHeight}
        mobile={isMobile}
        isLargeImageModal={isLargeImageModal}
      >
        {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
        {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
        {children}
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}
