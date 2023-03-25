import React from 'react'

import { PstlW3ProviderProps, PstlW3Providers } from '../providers'
import { ConnectionModal, ConnectionModalProps } from './ConnectionModal'

interface ConnectedConnectionModalProps {
  modalOptions: ConnectionModalProps
  web3Options: PstlW3ProviderProps
}

const ConnectedConnectionModal = ({ web3Options, modalOptions }: ConnectedConnectionModalProps) => (
  <PstlW3Providers config={web3Options}>
    <ConnectionModal {...modalOptions} />
  </PstlW3Providers>
)

export {
  ConnectedConnectionModal,
  ConnectionModal as StandaloneConnectionModal,
  ConnectedConnectionModalProps,
  ConnectionModalProps
}
