import { ColumnCenter, CookieBanner, PstlButton, Row } from '@past3lle/components'
import { ForgeW3Providers, useW3Connection } from '@past3lle/skillforge-web3'
import * as React from 'react'

import { PstlMain } from '../components/Layout'
import { commonProps, contractProps } from '../config/skillforge-web3'

const App = () => {
  return (
    <>
      <PstlMain>
        <ForgeW3Providers config={{ name: 'test', web3: commonProps, ...contractProps }}>
          <h1>Running skillforge-web3</h1>
          <InnerApp />
        </ForgeW3Providers>
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
  const [, { openW3Modal }, { address }] = useW3Connection()

  return (
    <ColumnCenter>
      <PstlButton onClick={() => openW3Modal({ route: 'ConnectWallet' })} backgroundColor="indianred">
        Open Modal
      </PstlButton>
      <Row>Address: {address}</Row>
    </ColumnCenter>
  )
}

export { App }
