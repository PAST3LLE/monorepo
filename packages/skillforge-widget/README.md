![skillforge-150](https://raw.githubusercontent.com/PAST3LLE/past3lle-monorepo/main/apps/skillforge-ui/src/assets/png/header_bg.png) 
# SKILLFORGE WIDGET

> PAST3LLE FORGE as an NPM importable ESM React widget component

## Install
```bash
yarn add @past3lle/skillforge-widget
```

## Usage
```tsx
import SkillForge, { SkillForgeConnectedHeader } from '@past3lle/skillforge-widget'
import { FontCssProvider, createCustomTheme } from '@past3lle/theme'

const APP_THEME = createCustomTheme({ /* ...custom theme */ }) 
const SKILLTREE_CONFIG = { /* ...config object */ }

// View full example of config and more in monorepo > apps > @past3lle/skillforge-ui 
export function App() {
  return (
    <SkillForge config={SKILLTREE_CONFIG.config} maxWidth={1200} maxHeight={750}>
      {/* Optional children props */}
      <FontCssProvider />
      {/* SkillForgeConnectedHeader is an optional, exported header connected to Web3 */}
      {/* and set with themed components */}
      <SkillForgeConnectedHeader />
    </SkillForge>
  )
}

```

Please raise issues in the appropriate repos! Enjoy :)