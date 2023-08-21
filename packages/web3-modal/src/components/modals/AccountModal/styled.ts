import { Column, Row } from '@past3lle/components'
import { fromExtraSmall, upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { PstlModalThemeExtension } from '../../../theme'
import { ModalButton, ModalTitleText } from '../common/styled'
import { ModalId } from '../common/types'

export const Icon = styled.img`
  margin-right: 10px;
  max-width: 23px;
  width: 100%;
  filter: ${({ theme }) => (theme?.modals?.account?.icons?.wallet?.invert ? 'invert(1)' : 'none')};
  opacity: 0.8;
`

export const AccountModalButton = styled(ModalButton).attrs((props) => ({
  height: props.height || 'auto',
  justifyContent: props.justifyContent || 'center',
  padding: props.padding || '0.3rem 0.75rem',
  ...props
}))<{ type: keyof PstlModalThemeExtension['modals']['account']['button'] }>`
  background: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.background?.background};
  color: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.color};
  font-size: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.size};
  font-style: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.style};
  letter-spacing: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.letterSpacing};
  font-weight: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.weight};
  font-variation-settings: 'wght' ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.weight};

  text-transform: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.textTransform};
  text-shadow: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.textShadow};
  text-align: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.font?.textAlign};

  border: ${({ theme, type }) => theme?.modals?.account?.button?.[type]?.border?.border};
`
export const FooterActionButtonsRow = styled(Row)`
  flex: 1 1 max-content;
`
export const AccountText = styled(ModalTitleText)<{
  type: keyof PstlModalThemeExtension['modals']['account']['text']
}>`
  line-height: 1.2;

  color: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.color};
  font-size: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.size};
  font-style: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.style};
  font-weight: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.weight};
  letter-spacing: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.letterSpacing};
  font-variation-settings: 'wght' ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.weight};

  text-transform: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.textTransform};
  text-shadow: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.textShadow};
  text-align: ${({ theme, type }) => theme?.modals?.account?.text?.[type]?.font?.textAlign};
`

export const AccountBottomColumnContainer = styled(Column)`
  background-color: ${({ theme }) => theme?.modals?.account?.container?.addressAndBalance?.background?.background};
  > ${Column}:first-child {
    flex: 0 1 68%;
    min-width: max-content;
  }
`

export const AccountLogosRow = styled(Row)<{ backgroundFrameColor?: string }>`
  width: 100%;
  > img {
    width: ${({ theme }) => theme.modals?.account?.connectionImages?.size};
    padding: 1rem;
    background-color: ${({ theme }) => theme.modals?.account?.connectionImages?.background?.background};
  }
  > img:first-child {
    margin-left: auto;
  }
  > img:last-child {
    margin-right: auto;
  }
`

export const AccountWalletNetworkRow = styled(Row)`
  z-index: 1;
  ${Row}#${ModalId.ACCOUNT}__wallets-button {
    cursor: pointer;
    > ${Column} {
      > ${AccountText} {
        font-weight: 200;
        font-variation-settings: 'wght' 200;
      }
    }
  }
  #${ModalId.ACCOUNT}__network-disconnect-buttons {
    gap: 10px;
    > ${AccountModalButton} {
      min-width: max-content;
    }
  }
  cursor: pointer;
  ${upToExtraSmall`
    > ${Column} > ${Row}#${ModalId.ACCOUNT}__network-disconnect-buttons {
      flex-flow: row wrap;
      ${AccountModalButton} {
        min-width: 180px;
        flex: 1;
      }
    }
  `}
`

export const AccountColumnContainer = styled(Column)`
  .unsupported-small-text {
    font-size: 0.6em;
    color: darkgrey;
    margin-left: 0.35rem;
    font-variation-settings: 'wght' 100;
    letter-spacing: -0.6px;
  }

  ${AccountModalButton} {
    height: 35px;
  }

  > ${Row} {
    // Details column
    > ${Column} {
      width: 100%;
      order: 0;
    }
    // Logo row
    > ${Row} {
      width: auto;
      flex: 1;
    }
  }

  ${upToSmall`
    > ${Row} {
      flex-flow: row wrap;
      
      // Details column
      > ${Column} {
        order: 2;
        margin: auto;
        max-width: unset;
      }

      // Logo row
      > ${Row} {
        order: 1;
        margin-bottom: 1rem;
        min-width: 150px;
        width: 100%;
        > img {
          width: 17vw;
          margin-left: auto;
        }
      }

      > ${ModalButton} {
          order: 2;
          margin: 1rem auto 0.5rem auto;
      } 
    }

    > ${Column} {
      > ${FooterActionButtonsRow} {
        flex-flow: column nowrap;
        gap: 0.5rem 0;
        width: 100%;
      }
    }
  `}

  ${({ theme }) => upToExtraSmall`
    // Address text
    ${AccountText}#pstl-web3-modal-address-text, ${AccountText}#pstl-web3-modal-wallet-text, ${AccountText}#pstl-web3-modal-network-text {
      font-size: calc(${theme.modals?.account?.text?.address?.font?.size} * 0.8);
    }
  `}

  ${fromExtraSmall`
    ${AccountBottomColumnContainer} {
      flex-flow: row wrap;

      > #${ModalId.ACCOUNT}__balance-text {
        order: 2;
      }

      > ${FooterActionButtonsRow} {
        margin: 0 0 0 auto;
        order: 1;

        > ${AccountModalButton}#${ModalId.ACCOUNT}__copy-button {
          display: none;
        }
      }
    }

    > ${Row} {
      // network/wallet wrapper
      > ${Column}:first-child {
        flex-flow: row nowrap;
        max-width: unset;

        div#pstl-w3modal-account__wallets-button {
          background: transparent;
          padding: 0;
          height: 100%;
          > ${Column} {
            height: 100%;
            justify-content: space-evenly;
          }
        }
        // Switch/Disconnect buttons
        > ${Row}:last-child {
          flex-flow: column nowrap;
          height: 100%;
          max-width: 32%;
          margin-top: 0;
        }
      }
    }
  `}
`
