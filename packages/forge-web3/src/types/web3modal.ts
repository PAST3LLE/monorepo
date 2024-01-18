import { PstlWeb3ModalProps } from '@past3lle/web3-modal'

import { FORGE_SUPPORTED_CHAINS } from '../constants/chains'

export type ForgeWeb3ModalProps = PstlWeb3ModalProps<typeof FORGE_SUPPORTED_CHAINS>
