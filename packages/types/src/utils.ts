export type Dictionary<T> = {
  [key: string]: T
}

export type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type Nullable<T> = T | null

export type MakeOptional<T, K extends keyof T> = Partial<T> & Pick<T, Exclude<keyof T, K>>

export type DeepRequired<T> = {
  [K in keyof T]-?: DeepRequired<T[K]>
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type DDPXImageUrlMap = { '1x': string; '2x'?: string; '3x'?: string }
export type GenericImageSrcSet<T extends number> = { defaultUrl: string } & {
  [key in T]: DDPXImageUrlMap
}
