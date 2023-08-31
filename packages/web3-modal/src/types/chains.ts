import { BlockExplorer, Contract, DeepReadonly, NativeCurrency, RpcUrls } from './misc'

export type Chain<ID extends number> = {
  /** ID in number form */
  id: ID
  /** Human-readable name */
  name: string
  /** Internal network name */
  network: string
  /** Currency used by chain */
  nativeCurrency: NativeCurrency
  /** Collection of RPC endpoints */
  rpcUrls: {
    [key: string]: RpcUrls
    default: RpcUrls
    public: RpcUrls
  }
  /** Collection of block explorers */
  blockExplorers?: {
    [key: string]: BlockExplorer
    default: BlockExplorer
  }
  /** Collection of contracts */
  contracts?: {
    ensRegistry?: Contract
    ensUniversalResolver?: Contract
    multicall3?: Contract
  }
  /** Flag for test networks */
  testnet?: boolean
}

export type ReadonlyChain<ID extends number> = DeepReadonly<Chain<ID>>
export type ChainsPartialReadonly<ID extends number> = ReadonlyChain<ID>[]

/**
 * @name ChainImages
 * @description Key/Value pair overriding chain image info. { ChainId: chainImageUri }
 */
export type ChainImages = {
  unknown?: string
  [id: number]: string
}
