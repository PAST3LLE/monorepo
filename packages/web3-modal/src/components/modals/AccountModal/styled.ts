import { Column, Row } from '@past3lle/components'
import { fromExtraSmall, upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { PstlSubModalsTheme, RequiredPstlSubModalsTheme } from '../../../theme'
import { ModalButton, ModalContainer, ModalText } from '../common/styled'
import { ModalId } from '../common/types'

export const Icon = styled.img`
  margin-right: 10px;
  max-width: 23px;
  width: 100%;
  filter: ${({ theme }) => (theme?.modals?.account?.icons?.wallet?.invert ? 'invert(1)' : 'none')};
  opacity: 0.8;
`

export const AccountModalButton = styled(ModalButton).attrs({ modal: 'account' })`
  justify-content: center;
`
export const FooterActionButtonsRow = styled(Row)`
  flex: 1 1 max-content;
`
export const AccountText = styled(ModalText).attrs((props) => ({
  modal: 'account',
  ...props
}))<{ cursor?: 'nesw-resize' | 'not-allowed' | 'pointer' | 'wait' | 'none' }>`
  ${({ cursor }) => cursor && `cursor: ${cursor};`}
`
export const AddressAndBalanceRow = styled(Row)``
export const AddressAndBalanceColumnContainer = styled(ModalContainer).attrs((props) => ({
  modal: 'account',
  node: 'main',
  overflowY: 'revert',
  ...props
}))<{ backgroundColor?: string; cursor: string }>`
  border: ${(props) => props.theme.modals?.account?.container?.main?.border?.border};
  border-color: ${(props) => props.theme.modals?.account?.container?.main?.border?.color};

  > ${Column}:first-child {
    flex: 0 1 65%;
    min-width: max-content;
  }
  ${upToExtraSmall`
    > ${Column}:first-child {
      width: 100%;
    }
  `}
`

export const AccountLogosRow = styled(Row)<{ backgroundFrameColor?: string }>`
  width: 100%;
  height: 88px;
  > img,
  > svg {
    box-sizing: border-box;
    height: 100%;
    max-width: ${({ theme }) => theme.modals?.account?.connectionImages?.size};
    padding: 1rem;
    background-color: ${({ theme }) => theme.modals?.account?.connectionImages?.background};
  }
  > img:first-child,
  > svg:first-child {
    margin-left: auto;
  }
  > img:last-child,
  > svg:last-child {
    margin-right: auto;
  }
`

export const WalletAndNetworkRowContainer = styled(ModalContainer).attrs((props) => ({
  as: Row,
  modal: 'account' as keyof PstlSubModalsTheme,
  node: 'main' as keyof RequiredPstlSubModalsTheme['account']['container'],
  overflowY: 'revert',
  ...props
}))<{ backgroundColor?: string; cursor: string }>`
  border: ${(props) => props.theme.modals?.account?.container?.main?.border?.border};
  border-color: ${(props) => props.theme.modals?.account?.container?.main?.border?.color};

  background-color: ${({ theme, modal, backgroundColor = theme.modals?.[modal]?.container?.alternate?.background }) =>
    backgroundColor};
  z-index: 1;

  ${Row}#${ModalId.ACCOUNT}__wallets-button {
    cursor: ${({ cursor }) => cursor};
    flex: 0 1 65%;
    min-width: max-content;
    ${upToExtraSmall`
      min-width: unset;
      > ${AccountText}:first-child {
        font-size: 12px;
      }
    `}
    > ${Column} {
      > ${AccountText} {
        font-weight: 300;
        font-variation-settings: 'wght' 300;
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

export const ModalColumnContainer = styled(ModalContainer)<{ layout: 'Account' | 'Other' }>`
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
    > ${Column} {
      width: 100%;
      order: 0;
    }
    > ${Row} {
      width: auto;
      flex: 1;
    }
  }

  ${Row}#pstl-web3-modal-wallet-text, ${Row}#pstl-web3-modal-network-text {
    > ${AccountText} {
      font-size: ${(props) => props.theme.modals?.account?.text?.subHeader?.size};
    }
  }

  ${({ layout = 'Account' }) => upToSmall`
    > ${Row} {
      flex-flow: row wrap;
      
      > ${Column} {
        order: ${layout === 'Account' ? 2 : 1};
        margin: auto;
        max-width: unset;
      }

      > ${Row} {
        order: ${layout === 'Account' ? 1 : 2};
        margin-bottom: 1rem;
        min-width: 150px;
        width: 100%;
        > img {
          width: 17vw;
          margin-left: auto;
        }
      }

      > ${ModalButton} {
          order: ${layout === 'Account' ? 2 : 1};
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

  ${({ layout = 'Account' }) => fromExtraSmall`
    ${ModalContainer} {
      flex-flow: row wrap;

      > #${ModalId.ACCOUNT}__balance-text {
        order: ${layout === 'Account' ? 2 : 1};
      }

      > ${FooterActionButtonsRow} {
        margin: 0 0 0 auto;
        order: ${layout === 'Account' ? 1 : 0};

        > ${AccountModalButton}#${ModalId.ACCOUNT}__copy-button {
          display: none;
        }
      }
    }

    > ${Row} {
      > ${Column}:first-child {
        flex-flow: row wrap;
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
        > ${Row}:last-child {
          flex-flow: column nowrap;
          height: 100%;
          margin-top: 0;
        }
      }
    }
  `}
`

export const AccountColumnContainer = styled(ModalColumnContainer).attrs({
  modal: 'Account',
  node: 'main',
  layout: 'Account'
})`
  padding: 0;
`
