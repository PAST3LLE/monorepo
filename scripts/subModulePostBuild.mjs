// @ts-check

/* eslint-disable no-console */
import { cp as copy, readFile, writeFile } from 'fs/promises'
import { basename, join, resolve } from 'path'

import { getFolderFiles } from './getFolderFiles.mjs'

const packagePath = process.cwd()
const distPath = join(packagePath, './dist')

function _argVToMap() {
  const args = process.argv.slice(2) || []
  const mapArgs = args.reduce((acc, _, index, oArr) => {
    const argsF = [oArr[index], oArr[index + 1]]
    if (!argsF[0] || !argsF[1]) {
      return acc
    }
    let mapItems = [oArr[index], oArr[index + 1]]
    // @ts-ignore
    acc.push(mapItems)
    return acc
  }, [])
  return new Map(mapArgs)
}

const _writeCommonPackageJson = (root, basePkg, filesAndFolderNames, addFiles) => {
  let cleanNames = []
  const subExportsMap = filesAndFolderNames.reduce((acc, name) => {
    const isFile = RegExp(/.(j|t)s/).test(name)
    const cleanName = name.split('.')[0]
    const key = './' + cleanName
    // create clean names array to avoid making it again later
    cleanNames.push(key.slice(1))

    acc[key] = {
      types: `${root}/types/${cleanName}` + (isFile ? '.d.ts' : '/index.d.ts'),
      import: `${root}/esm/` + (isFile ? `${cleanName}.js` : cleanName),
      default: `${root}/esm/` + (isFile ? `${cleanName}.js` : cleanName)
    }

    return acc
  }, {})

  const entryNames = root.replace('./', '')

  return {
    ...basePkg,
    private: false,
    typings: `${entryNames}/types/index.d.ts`,
    types: `${entryNames}/types/index.d.ts`,
    main: `${entryNames}/cjs/index.js`,
    module: `${entryNames}/esm/index.js`,
    exports: {
      '.': {
        import: `${root}/esm/index.js`,
        require: `${root}/cjs/index.js`
      },
      ...subExportsMap,
      './package.json': './package.json'
    },
    files: addFiles ? cleanNames.concat('/dist') : basePkg.files
  }
}

const _writeJson = (targetPath, obj) => writeFile(targetPath, JSON.stringify(obj, null, 2), 'utf8')

async function _createPackageFile(ignoreFiles) {
  const packageData = await readFile(resolve(packagePath, './package.json'), { encoding: 'utf8' })

  // @ts-ignore
  const srcFolderAndFileNames = await getFolderFiles('/src', ignoreFiles)

  const { scripts, devDependencies, ...packageOthers } = JSON.parse(packageData)

  const newPkgJson = _writeCommonPackageJson('.', packageOthers, srcFolderAndFileNames, true)
  const updatedPkgJson = _writeCommonPackageJson(
    './dist',
    { ...packageOthers, scripts, devDependencies },
    srcFolderAndFileNames,
    true
  )

  const newPkgJsonTargetPath = resolve(distPath, './package.json')
  const rootPkgJsonTargetPath = resolve(packagePath, './package.json')

  // write the dist package.json
  await _writeJson(newPkgJsonTargetPath, newPkgJson)
  console.log(`Created new package.json in ${newPkgJsonTargetPath}`)

  // update the root package.json
  await _writeJson(rootPkgJsonTargetPath, updatedPkgJson)
  console.log(`Updated root package.json in ${packagePath}`)

  return srcFolderAndFileNames.map((name) => name?.split('.')[0])
}

async function _includeFileInBuild(file) {
  const sourcePath = resolve(packagePath, file)
  const targetPath = resolve(distPath, basename(file))
  await copy(sourcePath, targetPath)
  console.log(`Copied ${sourcePath} to ${targetPath}`)
}

async function _writeGitIgnore(ignorePaths) {
  if (ignorePaths.length === 0) return
  const gitIgnorePath = packagePath + '/.gitignore'
  await writeFile(
    gitIgnorePath,
    `
# Generated file. Do not edit directly.
${ignorePaths.join('/\n')}/
`
  )
  console.log('Wrote new .gitignore')
}

async function run() {
  const ignoreFiles = JSON.parse(_argVToMap().get('--ignoreFiles') || '')
  try {
    const files = await _createPackageFile(ignoreFiles)
    await _includeFileInBuild('./README.md')
    await _writeGitIgnore(files || [])
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
