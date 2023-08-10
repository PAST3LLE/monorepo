import { polygon, goerli } from 'wagmi/chains'

export type SupportedChainsDevelop = 5 | 137
export type SupportedChainsProduction = 137
export type SupportedChains = SupportedChainsDevelop | SupportedChainsProduction
export const SUPPORTED_CHAINS = process.env.NODE_ENV === 'production' ? [polygon] : [polygon, goerli]
