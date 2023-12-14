import { ArticleFadeIn, RowProps, SmartImg } from '@past3lle/components'
import {
  BackgroundBlendMode,
  MediaWidths,
  setBackgroundOrDefault,
  setBackgroundWithDPI,
  setFlickerAnimation,
  upToLarge,
  upToMedium,
  upToSmall
} from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'
import styled from 'styled-components'

import { CursiveHeader, MonospaceText } from '../../Common/Text'

export const MAIN_COLOR = '#ebd7d7'
const DEFAULT_SIDE_PANEL_PROPS = {
  background: 'lightgrey',
  paddingMobile: '4rem 0',
  borderRadius: '0px',
  filter: 'none',
  flexDir: 'column' as RowProps['flexDirection'],
  flexWrap: 'nowrap' as RowProps['flexWrap'],
  padding: '4rem',
  transition: 'none',
  useMediaQueries: true,
  width: '40%',
  zIndex: 88
}

export type BgCssDpiProps = {
  bgSet: GenericImageSrcSet<MediaWidths>
  modeColors?: [string, string]
  blendMode?: BackgroundBlendMode
  attributes?: [string, string]
  preset?: 'header' | 'navbar' | 'logo'
}
export type SidePanelCssProps = Partial<typeof DEFAULT_SIDE_PANEL_PROPS> & {
  showFlickerAnimation?: boolean
}

export const BackgroundSmartImg = styled(SmartImg)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.25;
  z-index: 0;
  filter: hue-rotate(98deg) saturate(3.5) invert(1) blur(4px);

  > img {
    height: 100%;
    max-width: unset;
  }
`

export const StyledSidePanel = styled(ArticleFadeIn)<SidePanelCssProps & { dpiOptions?: BgCssDpiProps }>`
  position: fixed;
  > * {
    z-index: 1;
  }

  display: flex;
  flex-flow: ${({ flexWrap = DEFAULT_SIDE_PANEL_PROPS.flexWrap, flexDir = DEFAULT_SIDE_PANEL_PROPS.flexDir }) =>
    `${flexDir} ${flexWrap}`};

  z-index: ${({ zIndex = DEFAULT_SIDE_PANEL_PROPS.zIndex }) => zIndex};

  background: ${({ background = DEFAULT_SIDE_PANEL_PROPS.background }) => background};

  padding: ${({ padding = DEFAULT_SIDE_PANEL_PROPS.padding }) => padding};
  width: ${({ width = DEFAULT_SIDE_PANEL_PROPS.width }) => width};
  border-radius: ${({ borderRadius = DEFAULT_SIDE_PANEL_PROPS.borderRadius }) => borderRadius};

  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  filter: ${({ filter }) => filter};
  transition: ${({ transition }) => transition};

  > div#bg-tag {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    opacity: 0.4;

    ${({ showFlickerAnimation }) => showFlickerAnimation && setFlickerAnimation({ state: true, duration: 4, count: 2 })}

    ${({ theme, dpiOptions }) =>
      dpiOptions
        ? setBackgroundWithDPI(theme, dpiOptions.bgSet, {
            preset: dpiOptions?.preset || 'header',
            modeColours: dpiOptions?.modeColors || ['#fff', '#fff'],
            backgroundAttributes: dpiOptions?.attributes || [
              'center / cover no-repeat',
              'center 5px / cover no-repeat'
            ],
            backgroundBlendMode: dpiOptions?.blendMode || 'difference',
            lqIkUrlOptions: { dpi: '1x', transforms: [null, 'pr-true,q-2,w-50,h-700'] }
          })
        : setBackgroundOrDefault(
            theme,
            {
              bgValue: theme.assetsMap.logos.company.full,
              defaultValue: 'lightgrey'
            },
            { backgroundColor: 'lightgrey', backgroundAttributes: ['bottom/contain no-repeat'] }
          )}
  }

  ${CursiveHeader} {
    font-size: 5rem;
  }

  ${({ useMediaQueries = DEFAULT_SIDE_PANEL_PROPS.useMediaQueries }) => upToLarge`
    width: 50%;

    ${
      useMediaQueries &&
      `
        ${CursiveHeader} {
          font-size: 4vw;
        }
  `
    }
  `}

  ${upToMedium`
    width: 65%;
  `}

  ${({
    useMediaQueries = DEFAULT_SIDE_PANEL_PROPS.useMediaQueries,
    paddingMobile = DEFAULT_SIDE_PANEL_PROPS.paddingMobile
  }) => upToSmall`
    width: 100%;
    padding: ${paddingMobile};

    ${
      useMediaQueries &&
      `
      ${CursiveHeader} {
        font-size: 4.2rem;
      }
    `
    }
  `}

  ${MonospaceText} {
    font-size: 2rem;
    font-style: italic;
    text-align: left;
  }
`

export const ModalXButton = styled.div`
  position: absolute;
  right: 15px;
  top: 0.5rem;
  font-weight: 300;
  font-size: 3rem;
  cursor: pointer;
  color: ${MAIN_COLOR};
  z-index: 99;
`
