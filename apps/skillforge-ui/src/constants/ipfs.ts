import { CustomIpfsGatewayConfig } from '@past3lle/forge-web3'

export const IPFS_GATEWAY_URI_MAP = {
  PINATA: 'https://gateway.pinata.cloud',
  INFURA: 'https://infura-ipfs.io',
  PASTELLE_INFURA: 'https://pastelle.infura-ipfs.io',
  DEFAULT_IPFS: 'https://ipfs.io'
}

export const IPFS_GATEWAY_API_URI_MAP = {
  DWEB: 'https://dweb.link',
  DEFAULT_IPFS: 'https://ipfs.io'
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

export const GATEWAY_API_URIS: CustomIpfsGatewayConfig[] = [
  {
    gateway: IPFS_GATEWAY_API_URI_MAP.DWEB,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  },
  {
    gateway: IPFS_GATEWAY_API_URI_MAP.DEFAULT_IPFS,
    config: {
      // init: INFURA_IPFS_HEADERS
    }
  }
]
