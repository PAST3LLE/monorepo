import { CustomIpfsGatewayConfig } from '@past3lle/skillforge-web3'

export const IPFS_GATEWAY_URI_MAP = {
  PINATA: 'https://gateway.pinata.cloud/ipfs',
  INFURA: 'https://infura-ipfs.io/ipfs',
  PASTELLE_INFURA: 'https://pastelle.infura-ipfs.io/ipfs',
  DEFAULT_IPFS: 'https://ipfs.io/ipfs'
}

const INFURA_IPFS_64_ENCODED_AUTH_KEY = btoa(
  `${process.env.REACT_APP_INFURA_IPFS_KEY || 'DEFAULT_KEY'}:${
    process.env.REACT_APP_INFURA_SECRET_KEY || 'DEFAULT_SECRET_KEY'
  }`
)
export const INFURA_IPFS_HEADERS: RequestInit = {
  headers: {
    Authorization: `Basic ${INFURA_IPFS_64_ENCODED_AUTH_KEY}`
  }
}
export const PINATA_IPFS_HEADERS: RequestInit = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
  }
}

export const GATEWAY_URIS: CustomIpfsGatewayConfig[] = [
  {
    gateway: IPFS_GATEWAY_URI_MAP.PASTELLE_INFURA,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.INFURA,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.PINATA,
    config: {
      // init: PINATA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_URI_MAP.DEFAULT_IPFS
  }
]
