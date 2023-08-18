import { Button, CloseIcon, ColumnCenter, Modal, Text } from '@past3lle/components'
import { setBackgroundOrDefault, setBestTextColour, upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import BaseTheme from '../../../theme/baseTheme'
import { PstlWeb3ConnectionModalProps } from '../ConnectionModal'
import { RecommendedLabelWrapper } from '../ConnectionModal/RecommendedLabel'

const ERROR_CONTAINER_HEIGHT_PX = 120

export const ModalButton = styled(Button)<{ connected: boolean }>`
  position: relative;
  width: 100%;
  justify-content: flex-start;
  height: 82px;
  ${({ theme }) =>
    setBackgroundOrDefault(theme, {
      bgValue: theme?.modals?.connection?.button?.background?.backgroundImg,
      defaultValue: theme?.modals?.connection?.button?.background?.background as string
    })};

  border: ${({ theme }) => theme?.modals?.connection?.button?.border?.border};
  border-color: ${({ theme }) => theme?.modals?.connection?.button?.border?.color};

  font-style: ${({ theme }) => theme?.modals?.connection?.button?.font?.style};
  font-variation-settings: ${({ theme }) => `'wght' ${theme?.modals?.connection?.button?.font?.weight}`};
  color: ${({ theme }) =>
    theme?.modals?.connection?.button?.font?.color ||
    setBestTextColour(
      theme?.modals?.connection?.button?.background?.background ||
        BaseTheme.modes.DEFAULT.modals.connection.button.background.background
    )};

  letter-spacing: ${({ theme }) => theme?.modals?.connection?.button?.font?.letterSpacing};
  ${({ theme }) =>
    theme?.modals?.connection?.button?.font?.textShadow &&
    `text-shadow: ${theme?.modals?.connection?.button?.font.textShadow};`}

  ${({ theme }) =>
    theme?.modals?.connection?.button?.font?.size && `font-size: ${theme?.modals?.connection?.button?.font.size};`}
    
    ${({ theme }) => `text-transform: ${theme?.modals?.connection?.button?.font?.textTransform};`}
    
    gap: 10px;

  transition: transform 0.3s ease-in-out;
  &:hover {
    ${({ theme }) =>
      !!theme?.modals?.connection?.button?.hoverAnimations &&
      `
    transform: scale(1.05);
    filter: saturate(2);
  `}
  }

  ${({ connected, theme }) =>
    connected &&
    `
      background: ${theme?.modals?.connection?.button?.background?.connected};
      transform: scale(1.05);
      filter: saturate(2);
  `}
`

export const ModalTitleText = styled(Text.Main).attrs((props) => ({
  fontWeight: props.theme.modals?.base?.title?.font?.weight
}))`
  font-size: ${({ theme }) => theme?.modals?.base?.title?.font?.size};
  font-style: ${({ theme }) => theme?.modals?.base?.title?.font?.style};
  font-weight: ${({ theme }) => theme?.modals?.base?.title?.font?.weight};
  color: ${({ theme }) => theme?.modals?.base?.title?.font?.color};
  letter-spacing: ${({ theme }) => theme?.modals?.base?.title?.font?.letterSpacing};
  line-height: ${({ theme }) => theme?.modals?.base?.title?.font?.lineHeight};
`

export const ModalTitle = styled(ModalTitleText)`
  &&&&& {
    text-align: ${({ theme }) => theme.modals?.base?.title?.font?.textAlign};
    width: 100%;
    max-width: 92%;

    ${upToSmall`
      text-align: center;
    `}
  }
`

export const InnerContainer = styled(ColumnCenter)<{ isError?: boolean }>`
  filter: ${({ theme }) => theme?.modals?.base?.filter};

  position: relative;
  font-size: ${({ theme }) => theme?.modals?.connection?.baseFontSize}px;
  font-style: ${({ theme }) => theme?.modals?.base?.font?.style};
  font-weight: ${({ theme }) => theme?.modals?.base?.font?.weight};
  font-family: ${({ theme }) => theme?.modals?.base?.font?.family};

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  padding: ${({ theme: { modals } }) => modals?.connection?.padding};

  ${({ isError }) => isError && `padding-bottom: ${ERROR_CONTAINER_HEIGHT_PX}px;`}

  overflow-y: auto;

  ${CloseIcon} {
    color: ${({ theme }) => theme?.modals?.connection?.closeIcon?.color};
    width: ${({ theme }) => theme?.modals?.connection?.closeIcon?.size};
  }

  border-radius: ${({ theme: { modals } }) => modals?.connection?.button?.border?.radius};

  ${({ theme }) =>
    setBackgroundOrDefault(theme, {
      bgValue: theme?.modals?.connection?.background?.backgroundImg,
      defaultValue: theme?.modals?.connection?.background?.background as string
    })};
`

export const ErrorMessageContainer = styled(InnerContainer)<{ hide: boolean }>`
  opacity: ${({ hide }) => (hide ? 0 : 1)};

  overflow: auto;
  align-items: start;
  height: ${ERROR_CONTAINER_HEIGHT_PX}px;
  padding: 1rem 2rem;
  border-radius: 0 0 0.4rem 0.4rem;
  border-left: 0.5rem solid indianred;
  background: #00000070;
  position: absolute;
  bottom: 0;
  > p:first-child {
    margin: 0;
  }
  > p {
    font-family: monospace;
    color: indianred;
    font-variation-settings: 'wght' 500;
    font-size: 1rem;
    font-style: normal;
  }

  transition: opacity 0.5s ease-in-out;
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
            
             > ${ErrorMessageContainer} {
              border-radius: 0.4rem 0.4rem 0 0;
            }
          }

        }
      }
  `}
`

export const WalletsWrapper = styled.div<{
  isError?: boolean
  width?: string
  view?: PstlWeb3ConnectionModalProps['walletsView']
}>`
  display: grid;
  gap: 1rem;
  width: ${({ width = '100%' }) => width};
  padding: 0 1rem;
  z-index: 1;

  ${({ isError }) =>
    isError &&
    `
    z-index: 0;
    overflow-y: hidden;
  `}

  ${upToExtraSmall`
    grid-template-columns: 1fr;
  `}

  // Container
  > div {
    > ${ModalButton} {
      > img {
        height: 100%;
        max-height: ${({ theme }) => theme.modals?.connection?.button?.icons?.maxHeight || '50px'};

        ${upToExtraSmall`
          max-height: 100%;
        `}
      }
    }
  }

  ${({ view }) =>
    view === 'list' &&
    `
      > div {
        > ${ModalButton} {
          > img {
            height: 100%;
            max-height: 100%;
          }
        }
      }
  `}

  ${({ view, theme }) =>
    view === 'grid' &&
    `
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    justify-content: center;
    padding: 1rem;

    > div {
      > ${ModalButton} {
        flex-flow: column;
        padding: 0.75rem;
        justify-content: center;
        font-size: 0.8rem;
        
        > ${RecommendedLabelWrapper} {
          position: absolute;
          bottom: 0.5rem;
          height: min-content;
          right: 0.5rem;
        }

        > img {
          height: 100%;
          max-height: ${theme.modals?.connection?.button?.icons?.maxHeight || '64%'};
        }
      }
    }
  `}

  ${({ view, theme }) =>
    view === 'grid' &&
    upToSmall`
      > div {
        > ${ModalButton} {
          padding: 0.25rem;
          font-size: 0.75rem;
        
          > ${RecommendedLabelWrapper} {
            display: none;
          }

          > img {
            max-height: ${theme.modals?.connection?.button?.icons?.maxHeight || '64%'};
          }
        }
      }
  `}
`
