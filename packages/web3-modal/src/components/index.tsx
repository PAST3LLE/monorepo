import { PstlWeb3ModalProps } from '../providers'
import { PstlWeb3ConnectionModal, PstlWeb3ConnectionModalProps } from './ConnectionModal'

interface ConnectedConnectionModalProps {
  modalOptions: PstlWeb3ConnectionModalProps
  web3Options: PstlWeb3ModalProps
}

export { PstlWeb3ConnectionModal, ConnectedConnectionModalProps }
