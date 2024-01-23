---
'@past3lle/skillforge-widget': patch
'@past3lle/forge-web3': patch
'@past3lle/web3-modal': patch
'@past3lle/theme': patch
'@past3lle/utils': patch
'@past3lle/wagmi-connectors': patch
---

Prepare packages for V2 update.

- Add changesets + github workflows to monorepo
- web3-modal: updates to modals, types, logic, API, configuration
- wagmi-connectors: update ledger-hid, iframe-ethereum, web3auth connectors to V2 wagmi
- forge-web3: update to web3-modal/wagmi/viem V2 and optimise logic + API
- skillforge-web3: update to forge-web3/wagmi/viem V2 and optimise logic + API
- theme: fix deep merge logic
- skillforge-ui: update types for migration to V2
