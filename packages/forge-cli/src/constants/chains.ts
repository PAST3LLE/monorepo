import { SupportedNetworks } from '../types/networks'

export const networksToChainId: { [Network in SupportedNetworks]: number } = {
  [SupportedNetworks.MAINNET]: 1,
  [SupportedNetworks.GOERLI]: 5,
  [SupportedNetworks.MATIC]: 137,
  [SupportedNetworks.POLYGON]: 137,
  [SupportedNetworks.MUMBAI]: 80001
}
