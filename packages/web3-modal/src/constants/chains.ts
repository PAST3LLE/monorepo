// @ts-ignore
import UNKNOWN from '../assets/png/unknown.png'

export const CHAIN_IMAGES: Record<number, string> & { get: (param: any) => string } = {
  1: 'https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg',
  5: 'https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg',
  10: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg',
  100: 'https://cryptologos.cc/logos/gnosis-gno-gno-logo.svg',
  137: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  80001: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  get(prop: any) {
    if (this?.[prop]) {
      return this[prop] as string
    } else {
      return UNKNOWN
    }
  }
}
