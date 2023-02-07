import { Address, ResolvedConfig } from 'abitype'
import { ethers } from 'ethers'

// copies what is NOT exported from wagmi smh
export interface Overrides extends ethers.Overrides {
  gasLimit?: ResolvedConfig['BigIntType']
  gasPrice?: ResolvedConfig['BigIntType']
  maxFeePerGas?: ResolvedConfig['BigIntType']
  maxPriorityFeePerGas?: ResolvedConfig['BigIntType']
  nonce?: ResolvedConfig['IntType']
}
export interface PayableOverrides extends Overrides {
  value?: ResolvedConfig['IntType'] | ResolvedConfig['BigIntType']
}
export interface CallOverrides extends PayableOverrides {
  blockTag?: ethers.CallOverrides['blockTag']
  from?: Address
}
