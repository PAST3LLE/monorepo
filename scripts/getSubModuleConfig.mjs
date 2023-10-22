// @ts-check
export function getSubModuleConfig(name, packageJson) {
    const isFile = RegExp(/.(j|t)s/).test(name)
    const cleanName = name.split('.')[0]
    return {
        outputFolder: `${process.cwd()}/${cleanName}`,
        baseContents: {
          name: `${packageJson.name}/${cleanName}`,
          private: true,
          main: `../dist/cjs/${isFile ? cleanName : `${cleanName}/index`}.js`, // --> points to cjs format entry point of whole library
          module: `../dist/esm/${isFile ? cleanName : `${cleanName}/index`}.js`, // --> points to esm format entry point of individual component
          types: isFile ? `../dist/types/${cleanName}.d.ts` : `../dist/types/${cleanName}/index.d.ts`, // --> points to types definition file of individual component
        },
      }
}