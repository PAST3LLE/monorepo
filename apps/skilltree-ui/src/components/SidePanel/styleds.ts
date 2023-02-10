import { ArticleFadeIn, RowProps } from '@past3lle/components'
import { upToLarge, upToSmall } from '@past3lle/theme'
import { CursiveHeader, MonospaceText } from 'components/Text'
import styled from 'styled-components/macro'

const DEFAULT_SIDE_PANEL_PROPS = {
  background: 'lightgrey',
  padding: '4rem',
  width: '40%',
  borderRadius: '0px',
  flexDir: 'column' as RowProps['flexDirection'],
  flexWrap: 'nowrap' as RowProps['flexWrap'],
  zIndex: 999,
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
  bottom: 0;
  right: 0;

  ${CursiveHeader} {
    font-size: 6rem;
  }

  ${upToLarge`width: 50%;`}
  ${upToSmall`width: 90%;`}

  ${({ useMediaQueries = DEFAULT_SIDE_PANEL_PROPS.useMediaQueries }) =>
    useMediaQueries &&
    `
    ${upToLarge`
      ${CursiveHeader} {
        font-size: 4vw;
      }
    `}

    ${upToSmall`
      ${CursiveHeader} {
        font-size: 4rem;
      }
    `}
  `}

  ${MonospaceText} {
    font-size: 2rem;
    font-style: italic;
    text-align: left;
  }
`
