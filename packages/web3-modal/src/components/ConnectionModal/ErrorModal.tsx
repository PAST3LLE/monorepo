import React from 'react'
import { useTheme } from 'styled-components'

import { InnerContainer, ModalTitleText, StyledConnectionModal } from './styled'

export function ErrorModal() {
  const theme = useTheme()
  return (
    <StyledConnectionModal isOpen onDismiss={console.debug} width={'50vw'}>
      <InnerContainer justifyContent="flex-start" gap="0.75rem">
        <ModalTitleText
          fontSize={theme.modals?.connection?.title?.fontSize || '2em'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
          margin="0.2em 0"
        >
          UNKNOWN ERROR!
        </ModalTitleText>

        <ModalTitleText
          fontSize={'7rem'}
          fontStyle={'normal'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
        >
          T_T
        </ModalTitleText>

        <ModalTitleText
          fontSize={'1.5rem'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
        >
          Please refresh the page.
          <p style={{ lineHeight: 1.25 }}>
            If this continues, please contact us{' '}
            <a style={{ color: 'ghostwhite' }} href="mailto:pastelle.portugal@gmail.com">
              pastelle.portugal [at] gmail.com
            </a>
          </p>
        </ModalTitleText>
      </InnerContainer>
    </StyledConnectionModal>
  )
}
