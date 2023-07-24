import { ForwardedRef } from 'react'
import { UAParser } from 'ua-parser-js'

export * from './async'
export * from './chunkArray'
export * from './formatting'
export * from './logging'
export * from './node'
export * from './uriToHttp'
export * from './dom'
export * from './noop'
export * from './typeCheck'

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// Since this function reads from the navigator, ensure that all invocation
// take place inside of `useEffect`. This is to ensure that compatibility with gatsby,
// or any application rendered server side, is not broken. This is because globals like
// navigator and window aren't available on the server side, so these functions will need
// to be invoked at runtime.
export function isIOSDevice() {
  const iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod']

  if (!navigator) false

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) {
        return true
      }
    }
  }

  return false
}

const getParser = () =>
  globalThis?.window !== undefined ? new UAParser(globalThis.window.navigator.userAgent) : undefined
const getType = () => getParser()?.getDevice()?.type

export const getUserAgent = () => getParser()?.getResult()

export const getIsMobile = () => getType() === 'mobile' || getType() === 'tablet'

export const isTruthy = <T>(value: T | null | undefined | false): value is T => !!value

export const delay = <T = void>(ms = 100, result?: T): Promise<T> =>
  new Promise((resolve) => setTimeout(resolve, ms, result))

export function withTimeout<T>(promise: Promise<T>, ms: number, context?: string): Promise<T> {
  const failOnTimeout = delay(ms).then(() => {
    const errorMessage = 'Timeout after ' + ms + ' ms'
    throw new Error(context ? `${context}. ${errorMessage}` : errorMessage)
  })

  return Promise.race([promise, failOnTimeout])
}

export function isPromiseFulfilled<T>(
  promiseResult: PromiseSettledResult<T>
): promiseResult is PromiseFulfilledResult<T> {
  return promiseResult.status === 'fulfilled'
}

// To properly handle PromiseSettleResult which returns and object
export function getPromiseFulfilledValue<T, E = undefined>(
  promiseResult: PromiseSettledResult<T>,
  nonFulfilledReturn: E
) {
  return isPromiseFulfilled(promiseResult) ? promiseResult.value : nonFulfilledReturn
}

export const registerOnWindow = (registerMapping: Record<string, any>) => {
  Object.entries(registerMapping).forEach(([key, value]) => {
    ;(window as any)[key] = value
  })
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}

// shitty array "randomiser"
export function randomiseArray(arr: any[]) {
  const randomIndex = Math.round(Math.random() * arr.length)

  // 0 index, return original arr
  if (!randomIndex) return arr

  const adjustedArrEnd = arr.slice(randomIndex)
  const adjustedArrBeg = arr.slice(0, randomIndex - 1)
  const newFirstItem = arr[randomIndex - 1]

  return [newFirstItem, ...adjustedArrBeg, ...adjustedArrEnd]
}

export function setForwardedRef<T extends HTMLElement>(node: T, forwardedRef: ForwardedRef<T>) {
  if (typeof forwardedRef === 'function') {
    forwardedRef(node)
  } else if (forwardedRef?.current) {
    forwardedRef.current = node
  }
}
