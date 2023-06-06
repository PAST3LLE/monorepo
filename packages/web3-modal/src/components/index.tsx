import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../providers'
import { PstlWeb3ConnectionModal, PstlWeb3ConnectionModalProps } from './ConnectionModal'

interface ConnectedConnectionModalProps<ID extends number, SC extends ChainsPartialReadonly<ID>> {
  modalOptions: PstlWeb3ConnectionModalProps
  web3Options: PstlWeb3ModalProps<ID, SC>
}

export { PstlWeb3ConnectionModal, ConnectedConnectionModalProps }
