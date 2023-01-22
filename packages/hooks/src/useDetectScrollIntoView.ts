import { useEffect, useRef, useState } from 'react'

export type LoadInViewOptions = {
  container: Document | Element
  conditionalCheck?: boolean
}
export type DetectScrollIntoViewOptions = IntersectionObserverInit & { continuous?: boolean }
export function useDetectScrollIntoView(
  elem: HTMLElement | null | undefined,
  options: DetectScrollIntoViewOptions | undefined,
  defaultView: boolean
) {
  const [isInView, setIsInView] = useState(defaultView)
  const observerRef = useRef<IntersectionObserver>()

  useEffect(() => {
    const continuousCheck = !!options?.continuous
    if (!elem || (!continuousCheck && isInView)) return

    const observerCb: IntersectionObserverCallback = ([entry]: IntersectionObserverEntry[], observer) => {
      if ((entry as any)?.isVisible || entry.isIntersecting) {
        setIsInView(true)
        !continuousCheck && observer.unobserve(elem)
      } else {
        setIsInView(false)
        !continuousCheck && observer.unobserve(elem)
      }
    }

    !observerRef.current && (observerRef.current = new IntersectionObserver(observerCb, options))
    const observer = observerRef.current

    // start observation of elem
    observer?.observe(elem)

    // disconnect observer and close
    return () => {
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elem])

  return isInView
}
