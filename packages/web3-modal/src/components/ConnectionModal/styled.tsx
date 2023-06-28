import { Button, CloseIcon, ColumnCenter, Modal, Text } from '@past3lle/components'
import { setBackgroundOrDefault, setBestTextColour, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { PstlWeb3ConnectionModalProps } from '.'
import BaseTheme from '../../theme/baseTheme'
import { getPosition } from '../../utils'
import { RecommendedLabelWrapper } from './RecommendedLabel'

export const ModalButton = styled(Button)<{ connected: boolean }>`
  position: relative;
  width: 100%;
  justify-content: flex-start;
  height: 82px;
  ${({ theme }) =>
    setBackgroundOrDefault(theme, {
      bgValue: theme.modals?.connection?.button?.backgroundImg,
      defaultValue:
        theme.modals?.connection?.button?.backgroundColor ||
        BaseTheme.modes.DEFAULT.modals.connection.button.backgroundColor
    })};

  border: ${({ theme }) =>
    theme.modals?.connection?.button?.border?.border || BaseTheme.modes.DEFAULT.modals.connection.button.border.border};
  border-color: ${({ theme }) => theme.modals?.connection?.button?.border?.color};

  font-style: ${({ theme }) =>
    theme.modals?.connection?.button?.fontStyle || BaseTheme.modes.DEFAULT.modals.connection.button.fontStyle};
  font-variation-settings: ${({ theme }) =>
    `'wght' ${
      theme.modals?.connection?.button?.fontWeight || BaseTheme.modes.DEFAULT.modals.connection.button.fontWeight
    }`};
  color: ${({ theme }) =>
    theme.modals?.connection?.button?.color ||
    setBestTextColour(
      theme.modals?.connection?.button?.backgroundColor ||
        BaseTheme.modes.DEFAULT.modals.connection.button.backgroundColor
    )};

  letter-spacing: ${({ theme }) =>
    theme.modals?.connection?.button?.letterSpacing || BaseTheme.modes.DEFAULT.modals.connection.button.letterSpacing};
  ${({ theme }) =>
    theme.modals?.connection?.button?.textShadow && `text-shadow: ${theme.modals?.connection?.button?.textShadow};`}

  ${({ theme }) =>
    theme.modals?.connection?.button?.fontSize && `font-size: ${theme.modals?.connection?.button?.fontSize};`}
    
    ${({ theme }) =>
    `text-transform: ${
      theme.modals?.connection?.button?.textTransform || BaseTheme.modes.DEFAULT.modals.connection.button.textTransform
    };`}
    
    gap: 10px;

  transition: transform 0.3s ease-in-out;
  &:hover {
    ${({ theme }) =>
      !!theme.modals?.connection?.button?.hoverAnimations &&
      `
    transform: scale(1.05);
    filter: saturate(2);
  `}
  }

  ${({ connected, theme }) =>
    connected &&
    `
      background: ${
        theme.modals?.connection?.button?.connectedBackgroundColor ||
        BaseTheme.modes.DEFAULT.modals.connection.button.connectedBackgroundColor
      };
      transform: scale(1.05);
      filter: saturate(2);
  `}
`

export const ModalTitleText = styled(Text.SubHeader)`
  color: ${({ theme }) =>
    theme.modals?.connection?.title?.color || BaseTheme.modes.DEFAULT.modals.connection.title.color};
  letter-spacing: ${({ theme }) =>
    theme.modals?.connection?.title?.letterSpacing || BaseTheme.modes.DEFAULT.modals.connection.title.letterSpacing};
  line-height: ${({ theme }) =>
    theme.modals?.connection?.title?.lineHeight || BaseTheme.modes.DEFAULT.modals.connection.title.lineHeight};
`

export const InnerContainer = styled(ColumnCenter)`
  filter: ${({ theme }) => theme.modals?.connection?.filter};

  position: relative;
  font-size: ${({ theme }) =>
    theme.modals?.connection?.baseFontSize || BaseTheme.modes.DEFAULT.modals.connection.baseFontSize}px;
  font-style: italic;
  font-weight: 200;
  font-family: 'Roboto Flex', 'Inter', sans-serif, system-ui;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  padding: ${({ theme: { modals } }) =>
    modals?.connection?.padding || BaseTheme.modes.DEFAULT.modals.connection.padding};

  overflow-y: auto;

  > ${CloseIcon} {
    position: absolute;
    color: ${({ theme }) =>
      theme.modals?.connection?.closeIcon?.color || BaseTheme.modes.DEFAULT.modals.connection.closeIcon.color};

    width: ${({ theme }) =>
      theme.modals?.connection?.closeIcon?.size || BaseTheme.modes.DEFAULT.modals.connection.closeIcon.size};

    ${({ theme }) => getPosition(theme.modals?.connection?.closeIcon?.position)}
  }

  border-radius: ${({ theme: { modals } }) =>
    modals?.connection?.button?.border?.radius || BaseTheme.modes.DEFAULT.modals.connection.button.border.radius};

  ${({ theme }) =>
    setBackgroundOrDefault(theme, {
      bgValue: theme.modals?.connection?.backgroundImg,
      defaultValue:
        theme.modals?.connection?.backgroundColor || BaseTheme.modes.DEFAULT.modals.connection.backgroundColor
    })};
`

export const StyledConnectionModal = styled(Modal)`
  ${upToSmall`
    div {
      &[data-reach-dialog-content] {
          max-height: 500px;
          max-width: unset;
          width: 100%;
          margin: auto 0 0;
          
          > ${InnerContainer}{
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }
  `}
`

export const WalletsWrapper = styled.div<{ view?: PstlWeb3ConnectionModalProps['walletsView'] }>`
  width: 100%;

  > ${ModalButton} {
    > img {
      max-width: 50px;
    }
  }

  display: grid;
  gap: 1rem;

  ${({ view }) =>
    view === 'grid' &&
    `
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    justify-content: center;

    > ${ModalButton} {
      flex-flow: column;
      padding: 0.75rem;
      justify-content: center;
      font-size: 0.8rem;
      
      > ${RecommendedLabelWrapper} {
        position: absolute;
        top: 10px;
        height: min-content;
        right: 10px;
      }

      > img {
        max-width: 30px;
      }
    }
  `}

  ${upToSmall`
      > ${ModalButton} {
        padding: 0.25rem;
        font-size: 0.75rem;
      
        > ${RecommendedLabelWrapper} {
          display: none;
        }

        > img {
          max-width: 25px;
        }
      }
  `}
`
