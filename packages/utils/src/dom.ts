export function canUseDOM() {
  return !!(
    typeof globalThis?.window !== 'undefined' &&
    globalThis?.window.document &&
    globalThis?.window.document.createElement
  )
}

/**
 * Get an element's owner document. Useful when components are used in iframes
 * or other environments like dev tools.
 *
 * @param element
 */
export function getOwnerDocument<T extends Element>(element: T | null | undefined) {
  return canUseDOM() ? (element ? element.ownerDocument : document) : null
}

/**
 * TODO: Remove in 1.0
 */
export function getOwnerWindow<T extends Element>(element: T | null | undefined) {
  const ownerDocument = getOwnerDocument(element)
  return ownerDocument ? ownerDocument.defaultView || globalThis?.window : null
}
