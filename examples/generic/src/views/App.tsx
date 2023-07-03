import { ColumnCenter, CookieBanner, PstlButton, Row } from '@past3lle/components'
import { useW3Connection } from '@past3lle/forge-web3'
import * as React from 'react'

import { PstlMain } from '../components/Layout'

const App = () => {
  return (
    <>
      <PstlMain>
        <h1>Running skillforge-web3</h1>
        <InnerApp />
      </PstlMain>

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

// InnerApp is a component that calls the useForgeW3 hook
function InnerApp() {
  const [, { openWalletConnectModal }, { address }] = useW3Connection()

  return (
    <ColumnCenter>
      <PstlButton onClick={() => openWalletConnectModal({ route: 'ConnectWallet' })} backgroundColor="indianred">
        Open Modal
      </PstlButton>
      <Row>Address: {address}</Row>
    </ColumnCenter>
  )
}

export { App }
