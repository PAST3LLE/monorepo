import { MediaWidths } from '../theme/styles/mediaQueries'

export type Dictionary<T> = {
  [key: string]: T
}

export type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type Nullable<T> = T | null

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type DDPXImageUrlMap = { '1x': string; '2x'?: string; '3x'?: string }
export type GenericImageSrcSet = { defaultUrl: string } & {
  [K in MediaWidths]: DDPXImageUrlMap
}
