import { CloseIcon, Row } from '@past3lle/components'
import { useOnKeyPress } from '@past3lle/hooks'
import React, { useMemo } from 'react'

import { Z_INDICES } from '../../../constants'
import { WithError } from '../../../controllers/types/controllerTypes'
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
  modal,
  children,
  ...restModalProps
}: BaseModalProps) {
  const { state, resetErrors } = usePstlWeb3ModalStore()
  const error = useMemo(
    // We can safely typecase here as we are conditinoally checking the error prop
    // that doesn't exist on the 'root' state slice but does exist on the others
    () => (Object.values(state).filter((value) => !!(value as WithError)?.error)?.[0] as WithError)?.error,
    [state]
  )
  const [showError, hideError] = useAutoClearingTimeout(!!error?.message, 7000, resetErrors)

  // Close modal on key press
  useOnKeyPress(restModalProps.closeModalOnKeys || [], onDismiss)

  return (
    <StyledConnectionModal
      id={ModalId.BASE}
      modal={modal}
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
      <InnerContainer
        modal="base"
        node="main"
        justifyContent="flex-start"
        gap="0.75rem"
        isError={!!state.connect?.error?.message}
      >
        <Row width="100%" marginBottom="0.5em">
          <ModalTitle>{title}</ModalTitle>
          <CloseIcon height={30} width={100} onClick={onDismiss} />
        </Row>
        {children}
        <ErrorMessage message={error?.message} hide={!showError || !error?.message} onClick={hideError} />
      </InnerContainer>
    </StyledConnectionModal>
  )
}
