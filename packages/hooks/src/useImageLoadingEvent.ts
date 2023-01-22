import { useEffect, useState } from 'react'

export function useImageLoadingEvent(imageElem: HTMLImageElement | null) {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!imageElem?.addEventListener) return

    const handleImageLoaded = () => setImageLoaded(true)

    imageElem.addEventListener('load', handleImageLoaded)
    return () => {
      imageElem.removeEventListener('load', handleImageLoaded)
    }
  }, [imageElem])

  return imageLoaded
}
