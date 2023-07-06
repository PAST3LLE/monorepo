import {
  LoadInViewOptions,
  useDetectScrollIntoView,
  useEffectRef,
  useImageLoadingEvent,
  useStateRef
} from '@past3lle/hooks'
import { MediaWidths, getLqIkUrl } from '@past3lle/theme'
import { DDPXImageUrlMap } from '@past3lle/types'
import { setForwardedRef } from '@past3lle/utils'
import { IKContext, IKImage } from 'imagekitio-react'
import React, { ForwardedRef, Fragment, forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { ColumnCenter } from '../Layout'

export type ImageKitTransformation = { [x: string]: undefined | number | string | boolean }[]

export interface LqImageOptions {
  width: number
  height: number
  showLoadingIndicator: boolean
}

interface BaseImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  pathSrcSet?: { [sizekey in MediaWidths]: DDPXImageUrlMap }
  lazy?: boolean
  forwardedRef?: React.ForwardedRef<HTMLImageElement>
  transformation?: ImageKitTransformation
  loadInViewOptions?: LoadInViewOptions
  lqImageOptions?: LqImageOptions
  placeholderStyleProps?: { bgColor: string }
}

type ImagePropsWithDefaultImage = BaseImageProps & {
  path: { defaultPath: string }
}

type ImagePropsWithIkImage = BaseImageProps & {
  path: { ikPath: string }
}

export type SmartImageProps = (ImagePropsWithDefaultImage | ImagePropsWithIkImage) & { path: any }

const StyledPicture = styled.picture`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const PlaceholderPicture = styled(StyledPicture)<{ bgColor?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 275%;
  font-weight: 100;
  background-color: ${({ theme, bgColor = theme.blackOpaque }) => bgColor};
  filter: brightness(0.7);
  opacity: 0.38;

  > div {
    color: ${({ theme }) => theme.offwhite};
    font-weight: 100;
    font-size: 150%;
    letter-spacing: -1px;
    line-height: 0.8;
  }
`

const DEFAULT_LQ_IP = {
  quality: 5,
  blur: 10
}
const DEFAULT_LQ_IMAGE_OPTIONS = {
  width: 0,
  height: 0,
  showLoadingIndicator: true
}
const DEFAULT_TRANSFORMATIONS = [{ pr: true }]
const BASE_INTERSECTION_OPTIONS = {
  threshold: 0.1,
  delay: 1000
}

export function ApiImage({
  path,
  pathSrcSet,
  transformation,
  loadInViewOptions,
  lqImageOptions,
  lazy,
  forwardedRef
}: ImagePropsWithDefaultImage): JSX.Element | null
export function ApiImage({
  path,
  pathSrcSet,
  transformation,
  loadInViewOptions,
  lqImageOptions,
  lazy,
  forwardedRef
}: ImagePropsWithIkImage): JSX.Element | null
export function ApiImage({
  path,
  pathSrcSet,
  transformation = DEFAULT_TRANSFORMATIONS,
  loadInViewOptions,
  lqImageOptions = DEFAULT_LQ_IMAGE_OPTIONS,
  lazy = true,
  forwardedRef,
  ...rest
}: SmartImageProps): JSX.Element | null {
  // load if in view only!
  const [refToSet, ref] = useEffectRef<HTMLSpanElement>(null)
  const isInView = useDetectScrollIntoView(
    // elem to track is in view
    !!loadInViewOptions?.conditionalCheck ? ref?.current : undefined,
    {
      ...BASE_INTERSECTION_OPTIONS,
      // root component to use as "in view" containment
      root: loadInViewOptions?.container || (typeof document !== undefined ? (document as any) : undefined)
    },
    // default view state
    // if left blank will show
    // else use explicitly set boolean value
    loadInViewOptions === undefined
  )

  const [LQIP, derivedTransformations] = useMemo(
    () => [{ ...DEFAULT_LQ_IP, active: !!lqImageOptions }, transformation],
    [lqImageOptions, transformation]
  )

  const [innerImgRef, setInnerRef] = useStateRef(null, (node) => node)
  const imageLoaded = useImageLoadingEvent(innerImgRef)

  return (
    <>
      {lqImageOptions.showLoadingIndicator && !imageLoaded && (
        <PlaceholderPicture {...rest.placeholderStyleProps}>
          <ColumnCenter>
            <div>Loading content...</div>
          </ColumnCenter>
        </PlaceholderPicture>
      )}
      {path?.ikPath ? (
        <IKContext
          publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
          urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
          transformationPosition="path"
        >
          {/* Observable span to detect if in view */}
          <span ref={refToSet} />
          <IKImage
            {...rest}
            src={!isInView ? undefined : path?.ikPath}
            lqip={LQIP}
            transformation={derivedTransformations}
            ref={(node: typeof IKImage) => _setImgRef(forwardedRef, setInnerRef, node?.imageRef?.current)}
            // lazy breaks for itemLogo in AsideWithVideo - never sets intersecting to true
            // thus never loads fullSrcUrl (stuck to lq)
            loading={lazy ? 'lazy' : 'eager'}
          />
        </IKContext>
      ) : path?.defaultPath ? (
        <>
          {/* Observable span to detect if in view */}
          <span ref={refToSet} />
          <StyledPicture>
            {/* e.g [500, { 1x: 'cdn.shopify.com/123/image_500x@1x.webp', 2x: 'cdn.shopify.com/123/image_500x@2x.webp' }] */}
            {pathSrcSet &&
              isInView &&
              Object.entries(pathSrcSet).map(([size, dpiMap]) => (
                <Fragment key={size}>
                  <source
                    media={`only screen and (min-resolution: 3x) and (max-width: ${size}px)`}
                    srcSet={dpiMap['3x']}
                    type="image/webp"
                  />
                  <source
                    media={`only screen and (min-resolution: 2x) and (max-width: ${size}px)`}
                    srcSet={dpiMap['2x']}
                    type="image/webp"
                  />
                  <source media={`only screen and (max-width: ${size}px)`} srcSet={dpiMap['1x']} type="image/webp" />
                </Fragment>
              ))}
            <img
              src={!isInView ? undefined : path?.defaultPath}
              loading="lazy"
              ref={(node) => _setImgRef(forwardedRef, setInnerRef, node)}
              {...rest}
              style={imageLoaded || !lqImageOptions ? undefined : _getLqImageOptions(path, lqImageOptions)}
            />
          </StyledPicture>
        </>
      ) : null}
    </>
  )
}

function _setImgRef(
  forwardedRef: ForwardedRef<any> | undefined,
  setRef: (node: HTMLElement | null) => void,
  node: HTMLElement | null
): void {
  forwardedRef && setForwardedRef(node, forwardedRef)
  setRef(node)
}

function _getLqImageOptions(path: SmartImageProps['path'], lqImageOptions: SmartImageProps['lqImageOptions']) {
  const width = lqImageOptions?.width,
    height = lqImageOptions?.height

  if (!width || !height) return

  return {
    background: `url(${getLqIkUrl(undefined, {
      fallbackUrl: path?.defaultPath,
      transform: `q-1,bl-20,pr-true,w-${width},h-${height}:w-${width / 4},h-${height / 4}`
    })}) center/cover no-repeat`,
    width,
    height
  }
}

/**
 * SmartImg - required props:
 * @property path: base object containing defaultPath to image asset e.g path={{ defaultPath: '123' }}
 * @property pathSrcSet: optional list of srcSets containing mediaWidth sized urls, e.g: {
        500: { '1x': '123', '2x': optional, '3x': optional },
        720: { '1x': '123' },
        960: { '1x': '123' },
        1280: { '1x': '123' },
        1440: { '1x': '123' }
      }
 */
const SmartImg = forwardRef((props: SmartImageProps, ref: ForwardedRef<HTMLImageElement>) => (
  <ApiImage {...props} forwardedRef={ref} />
))
SmartImg.displayName = 'SmartImg'

export { SmartImg }
