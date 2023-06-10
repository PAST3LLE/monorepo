import { Column, Row } from '@past3lle/components'
import { useIsMobile } from '@past3lle/hooks'
import SkillForge, { SkillForgeProps, SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { RobotoVariableFontProvider } from '@past3lle/theme'
import { AppVersion } from 'components/AppVersion'
import { GATEWAY_URIS, GATEWAY_API_URIS } from 'constants/ipfs'
import React, { ReactNode } from 'react'
import { GothicFontCssProvider } from 'theme/fonts'
import { GlobalStyles } from 'theme/global'
import { skillforgeTheme as SKILLFORGE_THEME } from 'theme/skillforge'
import { W3aStyles } from 'theme/w3aStyles'
import { SKILLFORGE_APP_NAME, WEB3_PROPS } from 'web3/config/skillforge'
import { CONTRACT_ADDRESSES_MAP } from 'web3/constants/addresses'
import { METADATA_URIS_MAP } from 'web3/constants/metadata'

const SKILLFORGE_CONFIG: SkillForgeProps = {
  config: {
    name: SKILLFORGE_APP_NAME,
    theme: SKILLFORGE_THEME,
    web3: WEB3_PROPS,
    contractAddresses: CONTRACT_ADDRESSES_MAP,
    metadataUris: METADATA_URIS_MAP,
    skillOptions: {
      metadataFetchOptions: {
        gatewayUris: GATEWAY_URIS,
        gatewayApiUris: GATEWAY_API_URIS
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
  const isMobile = useIsMobile()
  return (
    <FontsAndCssProviders>
      <Column width="100%">
        <Row height={'100vh'}>
          <SkillForge
            config={SKILLFORGE_CONFIG.config}
            maxWidth={isMobile ? '100%' : '90%'}
            maxHeight={isMobile ? '100%' : '90%'}
            render={() => (
              <>
                <W3aStyles />
                <SkillForgeConnectedHeader />
              </>
            )}
          />
        </Row>
        <AppVersion />
      </Column>
    </FontsAndCssProviders>
  )
}
