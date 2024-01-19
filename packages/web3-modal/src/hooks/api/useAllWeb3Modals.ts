import { usePstlWeb3Modal } from './usePstlWeb3Modal'

export type AllWeb3ModalStore = {
  root: ReturnType<typeof usePstlWeb3Modal>
  // walletConnect: ReturnType<typeof useWeb3Modal>
}
export function useAllWeb3Modals(): AllWeb3ModalStore {
  return {
    root: usePstlWeb3Modal(),
    // walletConnect: useWeb3Modal()
  }
}
