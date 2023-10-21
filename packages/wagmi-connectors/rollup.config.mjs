import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import generatePackageJson from "rollup-plugin-generate-package-json";
import packageJson from "./package.json" assert { type: "json" };
import fs from 'fs/promises'

const fileNames = (await fs.readdir(process.cwd() + '/src')).filter(name => {
  switch(name) {
    case 'index.ts':
    case 'utils.ts':
      return false
    default:
      return true
  }
})

export default [
  {
    input: 'dist/cjs/index.js',
    output: [
      {
        file: 'dist/bundles/bundle.esm.js',
        format: 'esm',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: 'dist/bundles/bundle.esm.min.js',
        format: 'esm',
        plugins: [terser()],
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: 'dist/bundles/bundle.umd.js',
        format: 'umd',
        name: '@past3lle/wagmi-connectors',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: 'dist/bundles/bundle.umd.min.js',
        format: 'umd',
        name: '@past3lle/wagmi-connectors',
        plugins: [terser()],
        sourcemap: true,
        inlineDynamicImports: true,
      }
    ],
    plugins: [
      typescript()
    ]
  },
  ...fileNames.map(name => ({
    input: `dist/cjs/${name}/index.js`,
    output: {
      file: `dist/${name}/index.js`,
      sourcemap: true,
      exports: 'named',
      format: 'esm',
    },
    plugins: [
      typescript(),
      generatePackageJson({
        baseContents: {
          name: `${packageJson.name}/${name}`,
          private: true,
          main: `../cjs/${name}/index.js`, // --> points to cjs format entry point of whole library
          module: "./index.js", // --> points to esm format entry point of individual component
          types: `../types/${name}/index.d.ts`, // --> points to types definition file of individual component
        },
      }),
    ]
  }))
]
