import { Z_INDICES } from '@past3lle/constants'
import { upToExtraSmall } from '@past3lle/theme'
import { getIsMobile } from '@past3lle/utils'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { animated } from 'react-spring'
import styled from 'styled-components'

import { DialogContent, DialogOverlay, DialogOverlayProps } from '../Dialog'

const AnimatedDialogOverlay = animated(DialogOverlay)
interface ModalStyleProps {
  overlayBackgroundColor?: string
  zIndex?: number
  boxShadowColor?: string
  mainBackgroundColor?: string
  width?: string
}
const StyledDialogOverlay = styled(
  ({
    // Pick out the non-dom-compatible custom props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    zIndex,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mainBackgroundColor,
    ...props
  }: DialogOverlayProps & { zIndex?: number; mainBackgroundColor?: string; id?: string; className?: string }) => (
    <AnimatedDialogOverlay {...props} />
  )
)<Pick<ModalStyleProps, 'overlayBackgroundColor' | 'zIndex'>>`
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
// need to disable the rule here and re-enable later (as it's formatted by eslint)
/* eslint-disable @typescript-eslint/no-unused-vars */
const StyledDialogContent = styled(
  ({
    mainBackgroundColor,
    height,
    margin,
    minHeight,
    maxHeight,
    maxWidth,
    width,
    isOpen,
    isLargeImageModal,
    tabIndex,
    zIndex,
    ...rest
  }) => <AnimatedDialogContent {...rest} tabIndex={tabIndex} />
).attrs({
  'aria-label': 'dialog'
})<Omit<ModalStyleProps, 'overlayBackgroundColor' | 'zIndex'>>`
  border: none;
  height: 100%;
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
    width: ${({ isLargeImageModal, width = '50vh' }) => (isLargeImageModal ? '90vh' : width)};
    max-width: ${({ maxHeight, maxWidth = '42rem', isLargeImageModal = false }) =>
      `${isLargeImageModal ? maxHeight : maxWidth}`};
    ${({ height }) => height && `height: ${height};`}
    ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight};`}
    ${({ minHeight }) => minHeight && `min-height: ${minHeight};`}
  }
`
// re-enable no-unused-vars
/* eslint-enable @typescript-eslint/no-unused-vars */
export interface ModalProps {
  // common dom props
  id?: string
  className?: string
  children?: React.ReactNode
  // flags
  bypassConfig?: { scroll?: boolean; focus?: boolean }
  isLargeImageModal?: boolean
  isOpen: boolean
  // inline style props
  tabIndex?: 0 | -1
  minHeight?: string
  maxHeight?: string
  height?: string
  maxWidth?: string
  width?: string | number
  margin?: string
  // ref
  initialFocusRef?: React.RefObject<any>
  // custom style props
  styleProps?: ModalStyleProps
  // callback
  onDismiss: () => void
}

export function Modal({
  id,
  bypassConfig,
  isOpen,
  children,
  className,
  tabIndex,
  onDismiss,
  margin,
  height,
  minHeight,
  maxHeight = '90vh',
  maxWidth,
  width = 50,
  styleProps = {},
  initialFocusRef,
  isLargeImageModal = false
}: ModalProps) {
  useEffect(() => {
    return () => {
      onDismiss()
    }
  }, [onDismiss])

  if (!isOpen) return null

  return (
    <StyledDialogOverlay
      id={id}
      className={className}
      onDismiss={onDismiss}
      initialFocusRef={initialFocusRef}
      unstable_lockFocusAcrossFrames={false}
      dangerouslyBypassFocusLock={bypassConfig?.focus}
      dangerouslyBypassScrollLock={bypassConfig?.scroll}
      {...styleProps}
    >
      <StyledDialogContent
        aria-label="dialog content"
        margin={margin}
        minHeight={minHeight}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        width={width}
        height={height}
        tabIndex={tabIndex}
        isLargeImageModal={isLargeImageModal}
        {...styleProps}
      >
        {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
        {tabIndex === undefined || initialFocusRef || !getIsMobile() ? null : <div tabIndex={1} />}
        {children}
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}
