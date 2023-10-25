import dedent from 'dedent'
import { execa } from 'execa'
import { default as fs } from 'fs-extra'

import path from 'path'
/**
 * 
 * @param {*} param0 
 * @returns {any}
 */
export function getConfig({ format = ['esm'], dev, noExport, ...options }) {
  if (!options.entry?.length) throw new Error('entry is required')
  const entry = options.entry ?? []

  // Hacks tsup to create Preconstruct-like linked packages for development
  // https://github.com/preconstruct/preconstruct
  if (dev) {
    const entry = options.entry ?? []
    return {
      clean: true,
      // Only need to generate one file with tsup for development since we will create links in `onSuccess`
      entry: [entry[0]],
      format: [(process.env.FORMAT) ?? 'esm'],
      silent: true,
      async onSuccess() {
        // remove all files in dist
        await fs.emptyDir('dist')
        // symlink files and type definitions
        for (const file of entry) {
          const filePath = path.resolve(file)
          const distSourceFile = filePath
            .replace(file, file.replace('src/', 'dist/'))
            .replace(/\.ts$/, '.js')
          // Make sure directory exists
          await fs.ensureDir(path.dirname(distSourceFile))
          // Create symlink between source and dist file
          await fs.symlink(filePath, distSourceFile, 'file')
          // Create file linking up type definitions
          const srcTypesFile = path
            .relative(path.dirname(distSourceFile), filePath)
            .replace(/\.ts$/, '')
          await fs.outputFile(
            distSourceFile.replace(/\.js$/, '.d.ts'),
            `export * from '${srcTypesFile}'`,
          )
        }
        const exports = await generateExports(entry, noExport)
        await generateProxyPackages(exports)
      },
    }
  }

  return {
    bundle: true,
    clean: true,
    dts: false,
    format,
    splitting: true,
    target: 'es2021',
    async onSuccess() {
      if (typeof options.onSuccess === 'function') await options.onSuccess()
      else if (typeof options.onSuccess === 'string') execa(options.onSuccess)

      const exports = await generateExports(entry, noExport)
      await generateProxyPackages(exports)
    },
    ...options,
  }
}

/**
 * Generate exports from entry files
 */
async function generateExports(entry, noExport) {
  const exports = {}
  for (const file of entry) {
    if (noExport?.includes(file)) continue
    const extension = path.extname(file)
    const fileWithoutExtension = file.replace(extension, '')
    const name = fileWithoutExtension
      .replace(/^src\//g, './')
      .replace(/\/index$/, '')
    const distEsmSourceFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/esm/',
    )}.js`
    const distCjsSourceFile = distEsmSourceFile.replace(/\/esm/, '')
    const distTypesFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/esm/',
    )}.d.ts`
    exports[name] = {
      types: distTypesFile,
      require: distCjsSourceFile,
      import: distEsmSourceFile,
      default: distEsmSourceFile,
    }
  }

  exports['./package.json'] = './package.json'

  const packageJson = await fs.readJSON('package.json')
  packageJson.exports = exports
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )

  return exports
}

/**
 * Generate proxy packages files for each export
 */
async function generateProxyPackages(exports) {
  const ignorePaths = []
  const files = new Set()
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === 'string') continue
    if (key === '.') continue
    if (!value.import) continue
    await fs.ensureDir(key)
    const esmEntrypoint = path.relative(key, value.import)
    const cjsEntrypoint = esmEntrypoint.replace(/\/esm/, '')
    const fileExists = await fs.pathExists(value.import)
    if (!fileExists)
      throw new Error(
        `Proxy package "${key}" entrypoint "${entrypoint}" does not exist.`,
      )

    await fs.outputFile(
      `${key}/package.json`,
      dedent`{
        "private": "true",
        "type": "module",
        "main": "${cjsEntrypoint}",
        "module": "${esmEntrypoint}",
        "types": "${value.types}"
      }`,
    )
    // @ts-ignore
    ignorePaths.push(key.replace(/^\.\//g, ''))

    const file = key.replace(/^\.\//g, '').split('/')[0]
    if (!file || files.has(file)) continue
    files.add(`/${file}`)
  }

  files.add('/dist')
  const packageJson = await fs.readJSON('package.json')
  packageJson.files = [...files.values()]
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )

  if (ignorePaths.length === 0) return
  await fs.outputFile(
    '.gitignore',
    dedent`
    # Generated file. Do not edit directly.
    ${ignorePaths.join('/**\n')}/**
  `,
  )
}