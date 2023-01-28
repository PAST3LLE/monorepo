export const INFURA_GATEWAY_URI = 'https://infura-ipfs.io/ipfs'
export const GATEWAY_URI = 'https://gateway.pinata.cloud/ipfs'
export const INFURA_IPFS_CONFIG: RequestInit = {
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${process.env.REACT_APP_PROJECT_ID}`
  }
}
