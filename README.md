<img src="https://user-images.githubusercontent.com/21335563/224188765-f886ae46-c251-431e-bc23-afbd851ae589.png"/>

# PAST3LLE LABS MONOREPO

Packages included:
1. [assets](/packages/assets): fonts and svgs common around all Past3lle apps!
2. [components](/packages/components): common layout components, cookie banner, modals
3. [constants](/packages/constants): layout sizes, etc.
4. [hooks](/packages/hooks): common hooks e.g useDetectScrollIntoView, useDebounce and many more
5. [theme](/packages/theme): ThemeProvider and general theme components, global styles and theme utils
6. [types](/packages/types): common types
7. [utils](/packages/utils): common utils e.g async wait(...) for promisifying and many others
8. [skillforge-widget](/packages/skillforge-widget): skillforge widget component for making PAST3LLE LABS rewards dapps
9. [skillforge-web3](/packages/skillforge-web3): common skillforge related web3 components/providers/hooks/utils
9. [wagmi-connectors](/packages/wagmi-connectors): Custom Wagmi connectors until officially released/supported by Wagmi
10. [web3-modal](/packages/web3-modal): Extensible Web3 connection modal exposing social login via web3auth and web3modal by default

Apps:
1. skillforge-ui - the SkillForge skills upgrade UI - get skills and skins [from the shop](https://pastelle.shop)
2. skills-nft - scripts for uploading metadata and images to IPFS
3. pastellelabs-landing-ui: PastelleLabs landing page

## From other projects: installation example
```bash
yarn add @past3lle/components @past3lle/theme @past3lle/utils
```

## Development

#### Setup
```
==========
** TIPS **
==========
* It's important to use the Workspace Typescript version. To change this in VSCode, select a TS file and click on the `{}` button inside the footer.
* Only YARN as a package manager is supported.
```
1. Install packages and dependencies: `yarn`
2. Stream build all packages: `yarn build`
3. Test that everything worked: `yarn cosmos:scope @past3lle/web3-modal`

#### Testing
```
==========
** TIPS **
==========
* Monorepo React based packages use React Cosmos for standalone testing/development
* Root package.json comes with syntactic sugar scripts to run stuff, see below
```
- To test a package in React Cosmos, use the root script: `yarn cosmos:scope <full-package-name>` e.g `yarn cosmos:scope @past3lle/web3-modal`
- `build`/`serve`/`cosmos`/`build:serve`/`types` all have `:scope` scripts to run individual packages within that script scope.

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
