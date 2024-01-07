import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

export function useUserOptionsTransactionCallbacks() {
  const { state } = usePstlWeb3ModalStore()
  return state.userOptions?.transactions
}
