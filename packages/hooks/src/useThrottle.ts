import throttle from 'lodash.throttle'
import { useEffect, useState } from 'react'

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)

  useEffect(() => {
    // Update debounced value after delay
    throttle(() => {
      setThrottledValue(value)
    }, delay)
  }, [value, delay])

  return throttledValue
}
