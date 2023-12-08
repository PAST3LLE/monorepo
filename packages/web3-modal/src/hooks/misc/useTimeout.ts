import { useCallback, useEffect, useState } from 'react'

let timeout: NodeJS.Timeout | undefined = undefined
export function useAutoClearingTimeout(
  flag: boolean,
  time = 3000,
  callback?: (error: Error | null) => void
): [boolean, () => void] {
  const [showError, setShowError] = useState(false)
  useEffect(() => {
    setShowError(true)
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    // Only set timeout on flag == true
    timeout = setTimeout(() => {
      setShowError(false)
      callback?.(null)
    }, time)

    return () => {
      timeout && clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, time])

  const resetError = useCallback(() => {
    clearTimeout(timeout)
    setShowError(false)
    callback?.(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [showError, resetError]
}
