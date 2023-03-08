import { ContractAddressMap } from '../types'

export type CommonHooksProps<M extends ContractAddressMap> = { collectionId: number; addressMap: M }
