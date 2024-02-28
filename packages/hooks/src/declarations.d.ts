declare module '*.ttf' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}

interface Window {
  __PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE: { width: number; height: number; ar: number }
  __PSTL_HOOKS_WINDOW_SIZE_CALLBACK: ({ width, height, ar }: { width: number | undefined; height: number | undefined; ar: number | undefined }) => void
  __PSTL_HOOKS_CONTEXT_LISTENER_COUNT?: number
  __PSTL_HOOKS_CONTEXT_LISTENER?: EventListener
}
