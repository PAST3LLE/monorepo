import React, { ReactNode, SyntheticEvent } from 'react'

import { ErrorMessageContainer } from './styled'

interface ErrorProps {
  message: ReactNode | undefined
  hide: boolean
  onClick: (e: SyntheticEvent) => void
}
export function ErrorMessage(props: ErrorProps) {
  return (
    <ErrorMessageContainer hide={props.hide}>
      <p>ERROR!</p>
      <p id="error-message">{props?.message}</p>
      <span id="error-close-icon" onClick={props.onClick}>
        X
      </span>
    </ErrorMessageContainer>
  )
}
