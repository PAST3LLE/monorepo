import { polygon, goerli } from 'wagmi/chains'

export const SUPPORTED_CHAINS = process.env.NODE_ENV === 'production' ? [polygon] : [polygon, goerli]
