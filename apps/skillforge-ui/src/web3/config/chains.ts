import { polygon, goerli } from 'viem/chains'

export type SupportedChainsDevelop = 5 | 137 | 80001
export type SupportedChainsProduction = 137
export type SupportedChains = SupportedChainsDevelop | SupportedChainsProduction
export const SUPPORTED_CHAINS_PROD = [polygon] as const
export const SUPPORTED_CHAINS_DEV = [goerli, polygon] as const
