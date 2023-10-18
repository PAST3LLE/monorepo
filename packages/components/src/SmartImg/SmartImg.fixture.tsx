import { useStateRef } from '@past3lle/hooks'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React, { useEffect } from 'react'

import { SmartImageProps, SmartImg } from './index'

function SmartWrapper(props: SmartImageProps) {
  const [ref, setRef] = useStateRef<HTMLVideoElement | null>(null, (node) => node)

  useEffect(() => {
    if (!ref) return
  }, [ref])

  return (
    <>
      <SmartImg ref={setRef} {...props} onClick={console.debug} />
    </>
  )
}
const BASE_PROPS = {
  path: {
    defaultPath:
      'https://cdn.shopify.com/s/files/1/0769/8510/6755/files/Screenshot2023-10-17at09.57.05_61e37ffa-378c-481a-a30f-dfc6ea276878_500x@3x.png.webp?v=1697539365'
  },
  pathSrcSet: urlToSimpleGenericImageSrcSet(
    'https://cdn.shopify.com/s/files/1/0769/8510/6755/files/Screenshot2023-10-17at09.57.05_61e37ffa-378c-481a-a30f-dfc6ea276878_500x@3x.png.webp?v=1697539365'
  )
}
export default {
  default: (
    <SmartImg
      {...BASE_PROPS}
      style={{
        maxWidth: '50%'
      }}
    />
  ),
  showTapToPlay: <SmartImg {...BASE_PROPS} />,
  autoStop: (
    <SmartWrapper
      path={{
        ikPath: ''
      }}
      pathSrcSet={BASE_PROPS.pathSrcSet}
    />
  )
}
