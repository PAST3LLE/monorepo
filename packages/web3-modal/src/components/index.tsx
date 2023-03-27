import { PstlW3ProviderProps } from '../providers'
import { PstlWeb3ConnectionModal, PstlWeb3ConnectionModalProps } from './ConnectionModal'

interface ConnectedConnectionModalProps {
  modalOptions: PstlWeb3ConnectionModalProps
  web3Options: PstlW3ProviderProps
}

export { PstlWeb3ConnectionModal, ConnectedConnectionModalProps }
