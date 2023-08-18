import { CloseIcon, Row } from '@past3lle/components'
import React from 'react'
import { useTheme } from 'styled-components'

import { Z_INDICES } from '../../../constants'
import { usePstlWeb3ModalState } from '../../../hooks'
import { useAutoClearingTimeout } from '../../../hooks/useTimeout'
import { ErrorMessageContainer, InnerContainer, ModalTitle, StyledConnectionModal } from './styled'
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
  const theme = useTheme()

  const { modalProps, updateModalProps } = usePstlWeb3ModalState()

  const [showError, hideError] = useAutoClearingTimeout(!!modalProps.connect?.error?.message, 7000, () =>
    updateModalProps({ connect: { error: null } })
  )

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
      styleProps={{
        // w3modal has 89 zindex
        zIndex,
        ...restModalProps.styleProps
      }}
      {...restModalProps}
    >
      <InnerContainer justifyContent="flex-start" gap="0.75rem" isError={!!modalProps.connect?.error?.message}>
        <Row width="100%" marginBottom="0.5em">
          <ModalTitle>{title}</ModalTitle>
          <CloseIcon height={30} width={100} onClick={onDismiss} />
        </Row>
        {children}
        <ErrorMessageContainer hide={!showError || !modalProps.connect?.error?.message}>
          <p>ERROR!</p>
          <p style={{ color: theme?.modals?.connection?.helpers?.color, fontSize: '0.75em' }}>
            {modalProps.connect?.error?.message}
          </p>
          <span
            onClick={hideError}
            style={{ position: 'absolute', color: 'ghostwhite', cursor: 'pointer', top: '0.75em', right: '0.75em' }}
          >
            X
          </span>
        </ErrorMessageContainer>
      </InnerContainer>
    </StyledConnectionModal>
  )
}
