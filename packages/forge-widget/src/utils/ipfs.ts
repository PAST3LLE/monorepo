export function fetchWithAuthentication(url: string, authToken: string) {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${authToken}`)
  return fetch(url, { headers })
}

export function fetchFromPinata(url: string) {
  if (!process.env.REACT_APP_PINATA_JWT) throw new Error('PINATA_JWT undefined. Check .env')
  return fetchWithAuthentication(url, process.env.REACT_APP_PINATA_JWT)
}

export function fetchFromInfura(url: string) {
  if (!process.env.REACT_APP_INFURA_KEY) throw new Error('INFURA_KEY undefined. Check .env')
  return fetchWithAuthentication(url, process.env.REACT_APP_INFURA_KEY)
}
