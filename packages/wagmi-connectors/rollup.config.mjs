import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";

const extensions = ['.js', '.jsx', '.ts', '.tsx' ];

export default  {
  input: 'src/index.ts',
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
    resolve({ extensions, moduleDirectories: ["src"] }),
    babel({ babelHelpers: 'bundled', include: ['src/**/*.tsx', 'src/**/*.ts'], extensions, exclude: 'node_modules/**'})
  ]
}
