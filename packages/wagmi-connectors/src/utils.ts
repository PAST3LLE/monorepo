export const isIframe = (): boolean => {
  try {
    return window.self !== window.top
  } catch (error) {
    return false
  }
}
