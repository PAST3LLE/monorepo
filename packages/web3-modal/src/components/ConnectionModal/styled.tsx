import { Button, CloseIcon, ColumnCenter } from '@past3lle/components'
import { setBestTextColour } from '@past3lle/theme'
import styled from 'styled-components'

import { getPosition } from '../../utils'

export const InnerContainer = styled(ColumnCenter)`
  position: relative;
  font-weight: 200;
  font-style: italic;
  font-family: 'Roboto', system-ui;

  background: ${({ theme }) => theme.content.modals?.connection?.background || 'rgb(201 172 172)'};
  padding: ${({
    theme: {
      content: { modals }
    }
  }) => modals?.connection?.padding || '1rem'};

  > ${CloseIcon} {
    color: ${({ theme }) => theme.content.modals?.connection?.closeIcon?.color || 'ghostwhite'};
    ${({ theme }) => getPosition(theme.content.modals?.connection?.closeIcon?.position)};
    width: ${({ theme }) => theme.content.modals?.connection?.closeIcon?.size || '1rem'};
  }

  > h1 {
    color: ${({ theme }) => theme.content.modals?.connection?.title?.color || 'ghostwhite'};
    font-weight: ${({ theme }) => theme.content.modals?.connection?.title?.fontWeight || 200};
    letter-spacing: ${({ theme }) => theme.content.modals?.connection?.title?.letterSpacing || '0px'};
  }

  > ${Button} {
    width: 100%;
    justify-content: flex-start;
    background: ${({ theme }) => theme.content.modals?.connection?.button?.background || 'rgba(0,0,0,0.9)'};

    border: ${({ theme }) => theme.content.modals?.connection?.button?.border?.border || '1px solid black'};
    border-color: ${({ theme }) => theme.content.modals?.connection?.button?.border?.color};

    font-weight: ${({ theme }) => theme.content.modals?.connection?.button?.fontWeight || 300};
    color: ${({ theme }) =>
      theme.content.modals?.connection?.button?.color ||
      setBestTextColour(theme.content.modals?.connection?.button?.background || 'ghostwhite')};

    ${({ theme }) =>
      theme.content.modals?.connection?.button?.textShadow &&
      `text-shadow: ${theme.content.modals?.connection?.button?.textShadow};`}

    ${({ theme }) =>
      theme.content.modals?.connection?.button?.fontSize &&
      `font-size: ${theme.content.modals?.connection?.button?.fontSize};`}
    
    ${({ theme }) => `text-transform: ${theme.content.modals?.connection?.button?.textTransform || 'none'};`}
    
    gap: 1rem;
  }
  border-radius: ${({
    theme: {
      content: { modals }
    }
  }) => modals?.connection?.button?.border?.radius || '1rem'};
`
