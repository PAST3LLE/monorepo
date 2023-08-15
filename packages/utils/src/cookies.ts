export function getReadonlyCookieStore() {
  if (!globalThis?.window || !globalThis?.document) return

  const splitCookies = document.cookie.split(';').map((item) => item.trim().split('='))
  const cookieStore = new Map<string, string>(splitCookies as [string, string][])

  return cookieStore
}

/**
 * @name getExpirementalCookieStore
 * @returns EXPIREMENTAL cookie store. Does NOT work in all browsers.
 * @warning Does NOT work in all browsers, see https://caniuse.com/?search=cookieStore
 */
export function getExpirementalCookieStore() {
  if (!globalThis?.window || !globalThis?.document) return

  return (globalThis?.window?.top as any)?.cookieStore || (globalThis?.window as any)?.cookieStore
}
