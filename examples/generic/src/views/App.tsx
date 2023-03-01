import { PNG } from '@past3lle/assets'
import { BV, Button, ColumnCenter, CookieBanner, Text as LayoutText, Modal, Pastellecon } from '@past3lle/components'
import { useOnClickOutside } from '@past3lle/hooks'
import SkilltreeBoard from '@past3lle/skilltree-widget'
import { ThemeModes } from '@past3lle/theme'
import * as React from 'react'
import { useTheme } from 'styled-components'

import { PstlFooter, PstlHeader, PstlMain, PstlNav } from '../components/Layout'
import { CUSTOM_THEME } from '../theme/skilltreeTheme'

const SKILLTREE_CONFIG = {
  appName: 'Pastelle Skilltree',
  appTheme: CUSTOM_THEME
}

interface Props {
  showBasic?: boolean
}
const App = ({ showBasic = false }: Props) => {
  const ref = React.useRef()
  const [modalOpen, setModalOpen] = React.useState(false)
  useOnClickOutside(ref, () => setModalOpen(false))

  const { mode, setMode } = useTheme()

  return (
    <>
      <Modal isOpen={modalOpen} onDismiss={console.debug}>
        <ColumnCenter style={{ backgroundColor: 'lightseagreen', width: '100%' }} ref={ref}>
          <LayoutText.SubHeader>MODAL OPEN</LayoutText.SubHeader>
          <LayoutText.Black>Click anywhere outside modal to close</LayoutText.Black>
        </ColumnCenter>
      </Modal>
      <PstlHeader>
        <Pastellecon />
      </PstlHeader>
      <PstlNav />
      {showBasic && (
        <PstlMain>
          <LayoutText.LargeHeader>EXAMPLE APP</LayoutText.LargeHeader>
          <LayoutText.SubHeader>Click button for modal!</LayoutText.SubHeader>
          <Button variant={BV.PRIMARY} onClick={() => setModalOpen(true)}>
            See modal
          </Button>
          <LayoutText.SubHeader>CURRENT THEME: {mode}</LayoutText.SubHeader>
          <Button
            variant={BV.THEME}
            onClick={() => setMode(mode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK)}
            bgImage={PNG.LogoCircle_2x}
            color={'#000'}
          >
            CHANGE THEME
          </Button>
        </PstlMain>
      )}
      <PstlMain>
        <SkilltreeBoard config={SKILLTREE_CONFIG} />
      </PstlMain>
      <PstlFooter>
        <ul>
          <LayoutText.SubHeader>Column 1</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.SubHeader>Column 2</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>

        <ul>
          <LayoutText.SubHeader>Column 3</LayoutText.SubHeader>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>
      </PstlFooter>
      <CookieBanner
        storageKey={process.env.REACT_APP_PASTELLE_COOKIE_SETTINGS || 'PASTELLE_COOKIE_SETTINGS'}
        message={'COOKIES?'}
        fullText={
          <div>
            <p>
              WE REALLY ONLY HAVE OPT-IN <strong>ANALYTICS</strong> COOKIES FOR 3 REASONS:
            </p>
            <div style={{ marginLeft: '2rem' }}>
              <p>1. See which of our items are most popular</p>
              <p>2. Assess which parts of our site aren&apos;t working well and/or where you guys are getting stuck</p>
              <p>3. Get a sense for if you guys like the showcase video option and other new features</p>
            </div>
          </div>
        }
        onAcceptAnalytics={() => console.warn('ANALYTICS COOKIES')}
        onSaveAndClose={() => console.warn('SAVING SETTINGS AND CLOSING')}
      />
    </>
  )
}

export { App }
