import { Column, Row, Text } from '@past3lle/components'
import { useForgeUserConfigAtom, useSupportedChainId, useW3UserConnectionInfo } from '@past3lle/forge-web3'
import { upToSmall } from '@past3lle/theme'
import React from 'react'
import styled, { useTheme } from 'styled-components'

import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { ThemedButtonActions } from '../../Common/Button'
import { CursiveMonoHeader, MonospaceText } from '../../Common/Text'
import { SidePanel } from '../BaseSidePanel'

interface ErrorPanelProps {
  title: string
  reason: Error
}
export function ErrorPanel(props: ErrorPanelProps) {
  const [userConfig] = useForgeUserConfigAtom()
  const chainId = useSupportedChainId()
  const { address } = useW3UserConnectionInfo()

  const [, setPanelState] = useSidePanelWriteAtom()

  const theme = useTheme()

  return (
    <SidePanel
      header="UH OH!"
      onDismiss={() => setPanelState()}
      styledProps={{ background: theme.sidePanels?.ERROR?.container?.backgroundColor || 'darkred' }}
    >
      <ErrorPanelContainer>
        <Column justifyContent={'center'} alignItems="flex-start" gap="2rem" padding="2rem" borderRadius="2rem">
          <Text.SubHeader fontSize={'2.5rem'} fontWeight={200} padding="0">
            {props.title}
          </Text.SubHeader>
          <Row>
            <strong style={{ marginRight: '1rem' }}>REASON:</strong>{' '}
            <MonospaceText color="orange">{props.reason.message}</MonospaceText>
          </Row>
          <p>
            {userConfig?.contentUrls?.FAQ && (
              <>
                <a href={userConfig.contentUrls.FAQ} target="_blank noreferrer">
                  Check our FAQ
                </a>{' '}
                for common problems and solutions.
              </>
            )}
            <p>
              If this error persists, please email us at: {userConfig.user.contactInfo.email} with the following
              details:
              <p className="error-panel-details" style={{ fontSize: '1.7rem', padding: '1rem' }}>
                <strong>CHAIN:</strong> {chainId}
                <br />
                <strong>ADDRESS:</strong> {address}
              </p>
            </p>
          </p>
        </Column>

        <Row justifyContent={'center'} margin={'2rem auto'}>
          <ThemedButtonActions onClick={() => setPanelState()} backgroundColor={'indianred'}>
            <Text.Black fontSize={'3rem'} fontWeight={100}>
              CLOSE
            </Text.Black>
          </ThemedButtonActions>
        </Row>
      </ErrorPanelContainer>
    </SidePanel>
  )
}

const ErrorPanelContainer = styled(Column)`
  overflow: hidden;
  height: 100%;
  padding: 2rem 0 0;
  font-size: 2rem;

  color: ${({ theme }) => theme.offwhite};

  img.icon8-icon {
    max-width: 3rem;
    margin-left: auto;
  }

  > ${Column}:first-of-type {
    background-color: ${({ theme }) => theme.blackOpaqueMost};

    > ${Text.SubHeader} {
      margin: 0;

      > strong {
        font-variation-settings: 'wght' 450;
      }
    }

    > p.error-panel-details {
      background-color: ${({ theme }) => theme.blackOpaqueMost};
      font-size: 1.7rem;
      padding: 1rem;
      border-radius: 1rem;
    }
  }

  ${() => upToSmall`
   img.icon8-icon {
    max-width: 3rem;
   }

    ${CursiveMonoHeader} > * {
      font-size: 1.8rem;
    }
  `}
`
