import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { getIsMobile } from '@past3lle/utils'
import React, { memo, useCallback, useState } from 'react'

import { usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { ConnectorEnhanced } from '../../../types'
import { NoChainLogo } from '../../NoChainLogo'
import { Callback } from '../ConnectionModal/ConnectorOption'
import { ModalText } from '../common/styled'
import { ModalId } from '../common/types'
import {
  ConfigModalContainer,
  DiagonalChoiceWrapper,
  DiagonalWrapper,
  ExplainerWrapper,
  StyledConnectorOption
} from './styled'

const CHOICES = [
  {
    key: 'EASY',
    label: 'Quick start',
    logo: 'https://cdn-icons-png.flaticon.com/512/5695/5695909.png',
    longDescription: (
      <p>
        Connect to the <strong>first</strong> account from the Ledger Live Ethereum derivation path:{' '}
        <strong>m/44'/60'/0'/0/0</strong>
      </p>
    ),
    shortDescription: 'quick start. Uses first Ledger Live address'
  },
  {
    key: 'CUSTOM',
    label: 'Advanced',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLhRN8ijcA65kiOwQWOrVNbogZDxBx617CTQ&usqp=CAU',
    longDescription: 'Advanced configuration options: custom derivation path, account scanning and selection',
    shortDescription: 'advanced setup options'
  }
] as const

function NetworkModalContent() {
  const modalCallbacks = usePstlWeb3Modal()

  const [, setSelectCount] = useState(0)

  const { connector } = useUserConnectionInfo()

  const modalCallback = useCallback(
    async (key: (typeof CHOICES)[number]['key']) =>
      key === 'CUSTOM' ? modalCallbacks.open({ route: 'HidDeviceOptions' }) : modalCallbacks.close(),
    [modalCallbacks]
  )

  // We need device aware selection here for better UX
  // Mobile needs to tap twice for button action as hover doesn't exist in mobile
  // Track tap amounts and conditionally either iterate state or call corresponding callback
  // On non-mobile devices we just call the callback
  const handleDeviceAwareSelection = useCallback(
    async (key: (typeof CHOICES)[number]['key']) => {
      const isMobile = getIsMobile()
      setSelectCount((state) => {
        const newState = state + 1
        const shouldCall = (!isMobile && !!key) || (!!newState && !!key && newState % 2 === 0)
        if (shouldCall) {
          modalCallback(key)
          return state
        } else {
          return newState
        }
      })
    },
    [modalCallback]
  )

  // We always show list view in tiny screens
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  const modalView = isExtraSmallScreen ? 'list' : 'grid'

  return (
    <ConfigModalContainer>
      {CHOICES.map(({ key, longDescription }) => (
        <ExplainerWrapper key={key}>
          <ModalText modal="base" node="main">
            {longDescription}
          </ModalText>
        </ExplainerWrapper>
      ))}
      <DiagonalWrapper id={`${ModalId.HID_DEVICE_OPTIONS}_config-type-wrapper`}>
        {CHOICES.map(({ key, label, logo }) => {
          return (
            <DiagonalChoiceWrapper key={key}>
              <StyledConnectorOption
                // keys & ids
                optionType="configType"
                optionValue={label}
                showHelperText
                // data props
                callback={(() => handleDeviceAwareSelection(key)) as Callback}
                modalView={modalView}
                connected={false}
                connector={connector as ConnectorEnhanced<any, any>}
                label={label}
                logo={logo ? <img src={logo} /> : <NoChainLogo />}
              />
            </DiagonalChoiceWrapper>
          )
        })}
      </DiagonalWrapper>
    </ConfigModalContainer>
  )
}

export default memo(NetworkModalContent)
