import { usePstlWeb3Modal } from './usePstlWeb3Modal'

export type Web3ModalsStore = {
  root: ReturnType<typeof usePstlWeb3Modal>
}
export function useAllWeb3Modals(): Web3ModalsStore {
  return {
    root: usePstlWeb3Modal()
  }
}
