import React, { ReactNode, SyntheticEvent } from 'react'

import { ErrorMessageContainer, ModalText } from './styled'

interface ErrorProps {
  message: ReactNode | undefined
  hide: boolean
  onClick: (e: SyntheticEvent) => void
}
export function ErrorMessage(props: ErrorProps) {
  return (
    <ErrorMessageContainer hide={props.hide}>
      <ModalText modal="base" node="header">
        ERROR!
      </ModalText>
      <ModalText id="error-message" modal="base" node="main">
        {props?.message}
      </ModalText>
      <ModalText id="error-close-icon" modal="base" node="header" onClick={props.onClick}>
        X
      </ModalText>
    </ErrorMessageContainer>
  )
}
