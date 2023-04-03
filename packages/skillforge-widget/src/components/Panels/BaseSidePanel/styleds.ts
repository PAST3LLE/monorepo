import { ArticleFadeIn, RowProps } from '@past3lle/components'
import { setBackgroundOrDefault, upToLarge, upToMedium, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { CursiveHeader, MonospaceText } from '../../Common/Text'

const DEFAULT_SIDE_PANEL_PROPS = {
  background: 'lightgrey',
  padding: '4rem',
  paddingMobile: '4rem 0',
  width: '40%',
  borderRadius: '0px',
  flexDir: 'column' as RowProps['flexDirection'],
  flexWrap: 'nowrap' as RowProps['flexWrap'],
  zIndex: 88,
  useMediaQueries: true as boolean
}

export type SidePanelCssProps = Partial<typeof DEFAULT_SIDE_PANEL_PROPS>

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

  > div#bg-tag {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    opacity: 0.4;

    ${({ theme }) =>
      setBackgroundOrDefault(
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
