import React from 'react'

import { Modal } from './index'

export default {
  default: (
    <Modal isOpen onDismiss={console.debug} styleProps={{ mainBackgroundColor: 'red' }}>
      <h1>DEFAULT MODAL</h1>
    </Modal>
  ),
  smallModal: (
    <Modal isOpen onDismiss={console.debug} styleProps={{ mainBackgroundColor: 'cyan' }} maxHeight={'500px'}>
      <h1 style={{ padding: '10px' }}>SMALL MODAL</h1>
    </Modal>
  )
}
