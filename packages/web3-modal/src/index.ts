import { ConnectedConnectionModalProps } from './components'
import { PstlWeb3ConnectionModal, PstlWeb3ConnectionModalProps } from './components/ConnectionModal'
import { PstlW3mConnectionHook, useConnection as usePstlConnection, usePstlWeb3Modal } from './hooks'

export * from './constants'
export * from './types'
export * from './providers'
export * from './theme'

export { type PstlWeb3AuthConnectorProps } from './connectors'
export {
  PstlWeb3ConnectionModal,
  usePstlConnection,
  usePstlWeb3Modal,
  type ConnectedConnectionModalProps,
  type PstlWeb3ConnectionModalProps,
  type PstlW3mConnectionHook
}
