import { PstlWeb3ModalProps } from '../providers'
import { PstlWeb3Modal } from './modals'

interface ConnectedConnectionModalProps<ID extends number> {
  modalOptions: any
  web3Options: PstlWeb3ModalProps<ID>
}

export { PstlWeb3Modal, type ConnectedConnectionModalProps }
