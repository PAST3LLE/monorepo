import { ArticleFadeIn, RowProps } from '@past3lle/components'
import {
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

export type SidePanelCssProps = Partial<typeof DEFAULT_SIDE_PANEL_PROPS> & {
  bgWithDpiOptions?: {
    bgSet: GenericImageSrcSet<MediaWidths>
    color?: string
  }
  showFlickerAnimation?: boolean
}

export const StyledSidePanel = styled(ArticleFadeIn)<SidePanelCssProps>`
  position: fixed;

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

    ${({ theme, bgWithDpiOptions }) =>
      bgWithDpiOptions
        ? setBackgroundWithDPI(theme, bgWithDpiOptions.bgSet, {
            preset: 'header',
            modeColours: [bgWithDpiOptions?.color || '#fff', '#fff'],
            backgroundAttributes: ['center / cover no-repeat', 'center 5px / cover no-repeat'],
            backgroundBlendMode: 'difference',
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
