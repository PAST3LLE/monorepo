import generatePackageJson from "rollup-plugin-generate-package-json";
import packageJson from "./package.json" assert { type: "json" };

import { getSubModuleConfig } from "../../scripts/getSubModuleConfig.mjs";
import { getFolderFiles } from "../../scripts/getFolderFiles.mjs";

// Get every folder and file name in /src/
const srcFolderAndFileNames = await getFolderFiles('/src', [/index.tsx?/, /theme.ts/, /types.ts/])

const CONFIG = srcFolderAndFileNames.map(name => {
  const isFile = RegExp(/.(j|t)s/).test(name)
  const cleanName = name.split('.')[0]
  
  return {
    input: `dist/cjs/${isFile ? cleanName : `${cleanName}/index`}.js`,
    plugins: [
      // Generate a package.json sub module file for each entry point
      generatePackageJson(getSubModuleConfig(name, packageJson)),
    ]
  }
})

export default CONFIG

