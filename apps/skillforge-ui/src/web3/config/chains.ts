import { goerli, polygon, polygonMumbai } from 'wagmi/chains'

export const SUPPORTED_CHAINS = process.env.NODE_ENV === 'production' ? [polygon] : [polygonMumbai, goerli]
