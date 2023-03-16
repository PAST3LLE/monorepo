declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
  }
}

declare module 'react-animated-slider'

declare module '*.svg' {
  export const src: string
  export default src
}

declare module '*.webp' {
  export const src: string
  export default src
}

declare module '*.webm' {
  export const src: string
  export default src
}

declare module '*.png' {
  export const src: string
  export default src
}

declare module '*.jpeg' {
  export const src: string
  export default src
}

declare module '*.otf' {
  export const src: string
  export default src
}

declare module '*.json' {
  export const src: string
  export default src
}
