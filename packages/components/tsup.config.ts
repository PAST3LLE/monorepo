import { defineConfig, Format } from 'tsup'
import { getConfig } from '../../scripts/getTsupConfig.mjs'
import { dependencies, peerDependencies } from './package.json'

export default defineConfig(getConfig({
    format: ['esm', 'cjs'],
    dev: false,
    entry: [
        'src/index.ts',
        'src/Button/index.tsx',
        'src/Cookies/index.tsx',
        'src/Dialog/index.tsx',
        'src/Error/index.tsx',
        'src/Icons/index.tsx',
        'src/Layout/index.tsx',
        'src/Links/index.tsx',
        'src/Loaders/index.tsx',
        'src/Modal/index.tsx',
        'src/Pastellecon/index.tsx',
        'src/Popover/index.tsx',
        'src/Portal/index.tsx',
        'src/SmartImg/index.tsx',
        'src/SmartVideo/index.tsx',
        'src/Text/index.tsx',
        'src/Tooltip/index.tsx',
    ],
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    platform: 'browser',
}))
