import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../providers'
import { PstlWeb3Modal } from './modals'

interface ConnectedConnectionModalProps<ID extends number, SC extends ChainsPartialReadonly<ID>> {
  modalOptions: any
  web3Options: PstlWeb3ModalProps<ID, SC>
}

export { PstlWeb3Modal, type ConnectedConnectionModalProps }
