import { Chain } from 'wagmi'

export interface ForgeW3ModalOpenOptions {
  uri?: string
  standaloneChains?: string[]
  route?: 'Account' | 'ConnectWallet' | 'Help' | 'SelectNetwork'
}
export interface ForgeW3ModalButtonProps {
  openW3Modal: (props: ForgeW3ModalOpenOptions) => void
  closeW3Modal: (props: ForgeW3ModalOpenOptions) => void
  setW3ModalDefaultChain: (props: Chain | undefined) => void
  isW3ModalOpen: boolean
}
