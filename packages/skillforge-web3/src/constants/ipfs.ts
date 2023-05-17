export const IPFS_GATEWAY_URI = 'https://ipfs.io/ipfs'
export const PINATA_GATEWAY_URI = 'https://gateway.pinata.cloud/ipfs'
export const INFURA_GATEWAY_URI = 'https://infura-ipfs.io/ipfs'
export const GATEWAY_URI = PINATA_GATEWAY_URI
export const INFURA_HEADERS: RequestInit = {
  headers: {
    Authorization: `Basic ${process.env.REACT_APP_INFURA_KEY}`
  }
}
export const PINATA_HEADERS: RequestInit = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
  }
}
