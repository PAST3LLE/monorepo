import { Column, Row } from '@past3lle/components'
import { upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { PstlModalThemeExtension } from '../../../theme'
import { ModalButton, ModalTitleText } from '../common/styled'

export const Icon = styled.img`
  margin-right: 10px;
  max-width: 20px;
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
`
export const FooterActionButtonsRow = styled(Row)``
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
`

export const AccountBottomColumnContainer = styled(Column)`
  background-color: ${({ theme }) => theme?.modals?.account?.balanceAndAddressContainer?.background?.background};
`

export const AccountColumnContainer = styled(Column)`
  .unsupported-small-text {
    font-size: 0.6em;
    color: darkgrey;
    margin-left: 0.35rem;
    font-variation-settings: 'wght' 100;
    letter-spacing: -0.6px;
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
        }
        // Logo row
        > ${Row} {
          order: 1;
          margin-bottom: 1rem;
          min-width: 150px;
          > img {
            width: 17vw;
            margin: auto;
          }
        }
        > ${ModalButton} {
            order: 2;
            margin: 1rem auto 0.5rem auto;
        } 
      }
      > ${Column} {
        > ${Row} {
          > ${AccountText} {
            font-size: 1.1em;
          }
        }
        > ${FooterActionButtonsRow} {
          flex-flow: column nowrap;
          gap: 0.5rem 0;
          width: 100%;
          > ${AccountModalButton} {
            height: 50px;
          }
        }
      }
    `}

  ${upToExtraSmall`
    > ${Row} {
      > ${Column} {
        max-width: unset;
      }
    }
    > ${Column} {
      > ${Row} {
        > ${AccountText} {
          font-size: 0.9em;
        }
      }
    }
  `}
`
