import React from 'react'

import { Modal } from './index'

export default {
  default: (
    <Modal isOpen onDismiss={console.debug} styleProps={{ mainBackgroundColor: 'red' }}>
      <h1>DEFAULT MODAL</h1>
    </Modal>
  ),
  smallModal: (
    <Modal isOpen onDismiss={console.debug} styleProps={{ mainBackgroundColor: 'red' }} maxHeight={10}>
      <h1>SMALL MODAL</h1>
    </Modal>
  )
}
