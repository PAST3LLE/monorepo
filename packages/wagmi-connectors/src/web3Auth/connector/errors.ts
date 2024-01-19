export class AdapterMissingError extends Error {
  constructor() {
    super('Web3Auth adapter missing in options object. Check configuration!')
  }
}

export class Web3AuthInstanceMissingError extends Error {
  constructor() {
    super('Web3Auth instance missing! Check configuration!')
  }
}
