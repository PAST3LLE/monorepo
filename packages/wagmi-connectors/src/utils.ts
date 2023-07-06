export const isIframe = (): boolean => {
  try {
    return typeof window !== undefined && window.self !== window.top
  } catch (error) {
    return false
  }
}
