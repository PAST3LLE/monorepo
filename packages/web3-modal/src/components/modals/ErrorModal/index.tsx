import React from 'react'
import { useTheme } from 'styled-components'

import { ModalTitleText } from '../common/styled'

export function ErrorModal() {
  const theme = useTheme()
  return (
    <ModalTitleText
      fontSize={'1.2em'}
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
  )
}
