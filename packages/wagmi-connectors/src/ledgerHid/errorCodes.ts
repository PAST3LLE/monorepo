export type ErrorCodes = 27906

type ErrorMessages = {
  [code in ErrorCodes]: string
}

export const ERROR_MESSAGES: ErrorMessages = {
  [27906]: 'Ledger locked! Please unlock and make sure your Ethereum app is open.'
}
