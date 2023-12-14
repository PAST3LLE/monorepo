import { Row } from '@past3lle/components'
import { useOnClickOutside, useOnKeyPress } from '@past3lle/hooks'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'

import { useSidePanelAtomBase } from '../../../state/SidePanel'
import { CursiveHeader } from '../../Common/Text'
import { DynamicBackArrow } from './common'
import {
  BackgroundSmartImg,
  BgCssDpiProps,
  MAIN_COLOR,
  ModalXButton,
  SidePanelCssProps,
  StyledSidePanel
} from './styleds'

export interface SidePanelProps {
  children: ReactNode
  header: string
  styledProps?: SidePanelCssProps
  onDismiss?: (...args: any[]) => void
  onBack?: (...args: any[]) => void
  options?: {
    backgroundImageOptions?: {
      smartImg?: {
        uri: string
      }
      backgroundCss?: {
        uri: string
        options?: BgCssDpiProps
      }
    }
    onClickOutsideConditionalCb?: (node: Node) => boolean
  }
}

export function SidePanel({ header, children, onBack, onDismiss, options, styledProps }: SidePanelProps) {
  const [{ type: panels }, setPanelState] = useSidePanelAtomBase()

  const onBackCallback = useCallback(() => {
    setPanelState((state) => ({ ...state, type: state.type.slice(1) }))
    onBack?.()
  }, [onBack, setPanelState])

  const onDismissCallback = useCallback(() => {
    setPanelState({ type: [] })
    onDismiss?.()
  }, [onDismiss, setPanelState])

  const ref = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(ref, onDismissCallback, options?.onClickOutsideConditionalCb)

  useOnKeyPress(['Escape', 'Esc'], onDismissCallback)

  const bgImageSrcSet = useMemo(() => {
    if (options?.backgroundImageOptions?.smartImg?.uri) {
      return urlToSimpleGenericImageSrcSet(options?.backgroundImageOptions?.smartImg?.uri)
    }
    return null
  }, [options?.backgroundImageOptions?.smartImg?.uri])

  return (
    <StyledSidePanel {...styledProps} dpiOptions={options?.backgroundImageOptions?.backgroundCss?.options} ref={ref}>
      {!bgImageSrcSet ? (
        <div id="bg-tag" />
      ) : (
        <BackgroundSmartImg
          id="bg-tag"
          path={{ defaultPath: bgImageSrcSet.defaultUrl }}
          pathSrcSet={bgImageSrcSet}
          loadInViewOptions={{ container: document, conditionalCheck: !!bgImageSrcSet }}
          lqImageOptions={{
            showLoadingIndicator: true,
            height: ref.current?.clientHeight || 0,
            width: ref.current?.clientWidth || 0
          }}
        />
      )}
      <DynamicBackArrow show={Boolean(panels?.length && onBack)} callback={onBackCallback} />
      {onDismiss && (
        <ModalXButton onClick={onDismissCallback}>
          <span>x</span>
        </ModalXButton>
      )}
      <Row>
        <CursiveHeader marginBottom="2rem" justifyContent={'center'} color={MAIN_COLOR}>
          {header}
        </CursiveHeader>
      </Row>
      {children}
    </StyledSidePanel>
  )
}
