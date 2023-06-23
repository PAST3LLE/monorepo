import { SupportedNetworks } from '../types/networks'

export function getGasStationUri(network: SupportedNetworks) {
  switch (network) {
    case SupportedNetworks.MAINNET:
      return 'https://ethgasstation.info/api/ethgasAPI.json?'
    case SupportedNetworks.GOERLI:
      return 'https://goerli.beaconcha.in/api/v1/execution/gasnow'
    case SupportedNetworks.MATIC:
      return 'https://gasstation.polygon.technology/v2'
    case SupportedNetworks.MUMBAI:
      return 'https://gasstation-testnet.polygon.technology/v2'
    default:
      return ''
  }
}
