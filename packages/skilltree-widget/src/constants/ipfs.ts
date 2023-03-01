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
export const IPNS_CID_MAP = {
  skills: 'k51qzi5uqu5di8arrds7ecwoc509xweq15qabdp4vfywn5zqfnz8teojji8aco',
  collections: 'k51qzi5uqu5dmgwvrlb3sglb18ze3hx5o1u6bunqnrhogg112j42u3p0gdr9ef'
}
