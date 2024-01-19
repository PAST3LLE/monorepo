import { Address } from 'viem'

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

export type Contract = {
  address: Address
  blockCreated?: number
}

export type RpcUrls = {
  http: readonly string[]
  webSocket?: readonly string[]
}

export type BlockExplorer = {
  name: string
  url: string
}

export type NativeCurrency = {
  name: string
  /** 2-6 characters long */
  symbol: string
  decimals: number
}
