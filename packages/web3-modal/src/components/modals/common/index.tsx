import { CloseIcon } from '@past3lle/components'
import React from 'react'
import { useTheme } from 'styled-components'

import { Z_INDICES } from '../../../constants'
import { usePstlWeb3ModalState } from '../../../hooks'
import { useAutoClearingTimeout } from '../../../hooks/useTimeout'
import { ErrorMessageContainer, InnerContainer, ModalTitleText, StyledConnectionModal } from './styled'
import { BaseModalProps } from './types'

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

  const showError = useAutoClearingTimeout(!!modalProps.connect?.error?.message, 7000, () =>
    updateModalProps({ connect: { error: null } })
  )

  return (
    <StyledConnectionModal
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
        <CloseIcon height={30} width={100} onClick={onDismiss} />
        <ModalTitleText
          fontSize={theme?.modals?.connection?.title?.fontSize || '2em'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
          margin="0.2em 0"
        >
          {title}
        </ModalTitleText>
        {children}
        <ErrorMessageContainer hide={!showError || !modalProps.connect?.error?.message}>
          <p>ERROR!</p>
          <p style={{ color: theme?.modals?.connection?.helpers?.color || 'ghostwhite', fontSize: 14 }}>
            {modalProps.connect?.error?.message}
          </p>
        </ErrorMessageContainer>
      </InnerContainer>
    </StyledConnectionModal>
  )
}
