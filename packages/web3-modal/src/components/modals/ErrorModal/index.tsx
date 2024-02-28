import React from 'react'

import { BaseModal } from '../common'
import { ModalText, ModalTitleText } from '../common/styled'

const IS_SERVER = typeof globalThis?.window === 'undefined'

export default function ErrorModal() {
  return (
    <BaseModal
      title="ERROR!"
      onDismiss={refreshWindow}
      isOpen
      modal="base"
      chainIdFromUrl={undefined}
      width="500px"
      maxWidth="500px"
    >
      <ModalText modal="base" node="subHeader" fontSize="1.8em">
        Uh oh, something went wrong!
      </ModalText>
      <ModalTitleText margin="2rem auto" fontSize={'7em'} fontStyle={'revert'}>
        :[
      </ModalTitleText>
      <ModalText modal="base" node="main" margin="2rem auto 0 0">
        Please refresh the page. If this continues, please contact us:{' '}
      </ModalText>
      <ModalTitleText fontSize="1.5em" margin="0 auto 0 0">
        <a style={{ color: 'inherit', outline: 'none' }} href="mailto:pastelle.portugal@gmail.com">
          pastelle.portugal [at] gmail.com
        </a>
      </ModalTitleText>
    </BaseModal>
  )
}

export function refreshWindow() {
  if (IS_SERVER) return
  return globalThis.window.location.reload()
}
