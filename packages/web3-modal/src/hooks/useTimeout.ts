import { useEffect, useState } from 'react'

let timeout: NodeJS.Timeout | undefined = undefined
export function useAutoClearingTimeout(flag: boolean, time = 3000) {
  const [showError, setShowError] = useState(false)
  useEffect(() => {
    setShowError(true)
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    timeout = setTimeout(() => setShowError(false), time)

    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [flag, time])
  return showError
}
