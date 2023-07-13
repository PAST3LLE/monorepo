import { Column, Row } from '@past3lle/components'
import { upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { ModalButton, ModalTitleText } from '../common/styled'

export const AccountModalButton = styled(ModalButton).attrs((props) => ({
  height: props.height || 'auto',
  justifyContent: props.justifyContent || 'center',
  color: props.color || 'ghostwhite',
  fontSize: props.fontSize || '0.8em',
  padding: props.padding || '0.25rem 0.75rem',
  ...props
}))`
  font-variation-settings: 'wght' 100;
`
export const FooterActionButtonsRow = styled(Row)``
export const AccountText = styled(ModalTitleText).attrs((props) => ({
  fontSize: props.fontSize || '1.2rem',
  fontWeight: props.fontWeight || 150,
  margin: props.margin || 0,
  fontStyle: props.fontStyle || 'normal',
  ...props
}))``

export const AccountColumnContainer = styled(Column)`
  ${upToSmall`
      > ${Row} {
        flex-flow: row wrap;
        > img {
          order: 1;
          width: 17vw;
          margin: auto;
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
    > ${Column} {
      > ${Row} {
        > ${AccountText} {
          font-size: 0.9em;
        }
      }
    }
  `}
`
