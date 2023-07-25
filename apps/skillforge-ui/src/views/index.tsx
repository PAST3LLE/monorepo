import { Column, Row } from '@past3lle/components'
import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { RobotoVariableFontProvider } from '@past3lle/theme'
import { AppVersion } from 'components/AppVersion'
import { GATEWAY_URIS, GATEWAY_API_URIS, CONTACT_EMAIL } from 'constants/index'
import React, { ReactNode } from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { GlobalStyles } from 'theme/global'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'
import { SKILLFORGE_APP_NAME, WEB3_PROPS } from 'web3/config/skillforge'
import { CONTRACT_ADDRESSES_MAP } from 'web3/constants/addresses'
import { METADATA_URIS_MAP } from 'web3/constants/metadata'

const SKILLFORGE_CONFIG: SkillForgeProps = {
  config: {
    name: SKILLFORGE_APP_NAME,
    boardOptions: {
      minimumBoardHeight: 550,
      minimumBoardWidth: 0,
      minimumColumns: 3
    },
    contactInfo: {
      email: CONTACT_EMAIL
    },
    contentUrls: {
      FAQ: 'https://faq.pastelle.shop/#upgrading'
    },
    theme: SKILLFORGE_THEME,
    web3: WEB3_PROPS,
    contractAddresses: CONTRACT_ADDRESSES_MAP,
    metadataUris: METADATA_URIS_MAP,
    skillOptions: {
      metadataFetchOptions: {
        gatewayUris: GATEWAY_URIS,
        gatewayApiUris: GATEWAY_API_URIS
      }
    },
    hooksProviderOptions: {
      windowSizes: {
        throttleMs: 750
      }
    }
  },
  dimensions: {
    mobile: {
      width: {
        max: '100%'
      },
      height: {
        max: '100%'
      }
    },
    desktop: {
      width: {
        max: '90%'
      },
      height: {
        max: '90%'
      }
    }
  }
}

const FontsAndCssProviders = ({ children }: { children?: ReactNode }) => (
  <>
    <RobotoVariableFontProvider />
    <GothicFontCssProvider />
    <GlobalStyles />
    {children}
  </>
)

export function App() {
  return (
    <FontsAndCssProviders>
      <Column width="100%">
        <Row height={'100vh'}>
          <SkillForge {...SKILLFORGE_CONFIG} render={() => <SkillForgeConnectedHeader />} />
        </Row>
        <AppVersion />
      </Column>
    </FontsAndCssProviders>
  )
}
