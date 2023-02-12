import { ArticleFadeIn, RowProps } from '@past3lle/components'
import { upToLarge, upToSmall, upToExtraSmall, upToMedium } from '@past3lle/theme'
import { CursiveHeader, MonospaceText } from 'components/Text'
import styled from 'styled-components/macro'

const DEFAULT_SIDE_PANEL_PROPS = {
  background: 'lightgrey',
  padding: '4rem',
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

  ${({ useMediaQueries = DEFAULT_SIDE_PANEL_PROPS.useMediaQueries }) => upToSmall`
    width: 90%;
    padding: 4rem 2rem;

    ${
      useMediaQueries &&
      `
      ${CursiveHeader} {
        font-size: 4.2rem;
      }
    `
    }
  `}
  ${upToExtraSmall`width: 100%;`}

  ${MonospaceText} {
    font-size: 2rem;
    font-style: italic;
    text-align: left;
  }
`
