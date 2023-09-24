import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default  {
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
}
