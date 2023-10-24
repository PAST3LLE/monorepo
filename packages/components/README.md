<img src="https://user-images.githubusercontent.com/21335563/224188765-f886ae46-c251-431e-bc23-afbd851ae589.png"/>

# @past3lle/components

Sub-Packages included:
1. [Button](/src/Button): common buttons of different themes
2. [Cookies](/src/Cookies): customisable cookie banner with local storage state retention
3. [Dialog](/src/Dialog): common dialog component with state
4. [Error](/src/Error): error boundary component for wrapping apps and gracefully handling errors
5. [Icons](/src/Icons): common icons
6. [Layout](/src/Layout): common layout components in flex with styled-components extensibility
7. [Links](/src/Links): common link components
8. [Loaders](/src/Loaders): common async loader components
9. [Modal](/src/Modal): common modal components built on dialog
9. [Pastellecon](/src/Pastellecon): app icons
10. [Popover](/src/Popover): popover components useful for custom tooltips
10. [Portal](/src/Portal): react portal component
10. [SmartImg](/src/SmartImg): smart img component for loading in view, multiple source/picture images and data saving responsiveness
10. [SmartVideo](/src/SmartVideo): smart video component for loading in view, multiple source/video videos and data saving responsiveness
10. [Text](/src/Text): common text components of different styles with styled-components extensibility
10. [Tooltip](/src/Tooltip): tooltip component built on top of popover

## From other projects: installation example
```bash
yarn add @past3lle/components
```

## Sub-module ESM import
```ts
// just import button - tree-shakes all other components
import { Button } from '@past3lle/components/Button'
// import lots of stuff - may not tree-shake some sub modules correctly, however
import { Button, Popover, Tooltip } from '@past3lle/components'
```

## Committing & PRs
Please use the commit message format: 
```
<package-sub-name>: concise change description

// e.g
web3-modal: enabled multi-chain in config
```

Please open pull requests with branch names in format:
```
<your-name>-<sub-module-name>/concise-feature-description

// e.g
steveo-web3-modal/added-multi-chain-config
```

## Issues
Open an issue [here](https://github.com/PAST3LLE/past3lle-monorepo/issues) and feel free to contribute!
