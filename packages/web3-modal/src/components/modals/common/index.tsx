import { CloseIcon, Row } from '@past3lle/components'
import { useOnKeyPress } from '@past3lle/hooks'
import React from 'react'

import { Z_INDICES } from '../../../constants'
import { usePstlWeb3ModalStore } from '../../../hooks'
import { useAutoClearingTimeout } from '../../../hooks/useTimeout'
import { ErrorMessage } from './ErrorMessage'
import { InnerContainer, ModalTitle, StyledConnectionModal } from './styled'
import { BaseModalProps, ModalId } from './types'

export function BaseModal({
  title = 'PSTL MODAL',
  width,
  maxWidth,
  maxHeight,
  zIndex = Z_INDICES.PSTL,
  isOpen,
  onDismiss,
  children,
  ...restModalProps
}: BaseModalProps) {
  const { state, updateModalProps } = usePstlWeb3ModalStore()

  const [showError, hideError] = useAutoClearingTimeout(!!state.connect?.error?.message, 7000, () =>
    updateModalProps({ connect: { error: null } })
  )

  // Close modal on key press
  useOnKeyPress(restModalProps.closeModalOnKeys || [], onDismiss)

  return (
    <StyledConnectionModal
      id={ModalId.BASE}
      className={restModalProps.className}
      isOpen={isOpen}
      onDismiss={onDismiss}
      width={width}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      // to prevent locking of focus on modal (with web3auth this blocks using their modal e.g)
      tabIndex={undefined}
      bypassConfig={{ scroll: !!state.root?.bypassScrollLock }}
      styleProps={{
        // w3modal has 89 zindex
        zIndex,
        ...restModalProps.styleProps
      }}
      {...restModalProps}
    >
      <InnerContainer justifyContent="flex-start" gap="0.75rem" isError={!!state.connect?.error?.message}>
        <Row width="100%" marginBottom="0.5em">
          <ModalTitle>{title}</ModalTitle>
          <CloseIcon height={30} width={100} onClick={onDismiss} />
        </Row>
        {children}
        <ErrorMessage
          message={state.connect?.error?.message}
          hide={!showError || !state.connect?.error?.message}
          onClick={hideError}
        />
      </InnerContainer>
    </StyledConnectionModal>
  )
}
