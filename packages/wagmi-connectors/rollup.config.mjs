import typescript from "@rollup/plugin-typescript";

import generatePackageJson from "rollup-plugin-generate-package-json";
import packageJson from "./package.json" assert { type: "json" };

import { getSubModuleConfig } from "../../scripts/getSubModuleConfig.mjs";
import { getFolderFiles } from "../../scripts/getFolderFiles.mjs";

const srcFolderAndFileNames = await getFolderFiles('/src')

const CONFIG = srcFolderAndFileNames.map(name => {
  const isFile = RegExp(/.(j|t)s/).test(name)
  const cleanName = name.split('.')[0]
  
  return {
    input: `dist/cjs/${isFile ? cleanName : `${cleanName}/index`}.js`,
    output: {
      file: `dist/esm/${isFile ? cleanName : `${cleanName}/index`}.js`,
      sourcemap: true,
      exports: 'named',
      format: 'esm',
    },
    plugins: [
      typescript(),
      generatePackageJson(getSubModuleConfig(name, packageJson)),
    ]
  }
})

export default CONFIG

