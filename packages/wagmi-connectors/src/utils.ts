export const isIframe = (): boolean => {
  try {
    return typeof globalThis?.window !== undefined && globalThis.window.self !== globalThis?.window.top
  } catch (error) {
    return false
  }
}
