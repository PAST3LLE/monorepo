// @ts-check
/* eslint-disable no-console */
import { resolve, join, basename } from 'path';
import { readFile, writeFile, cp as copy } from 'fs/promises';
import { getFolderFiles } from './getFolderFiles.mjs';
const packagePath = process.cwd();
const distPath = join(packagePath, './dist');

const writeJson = (targetPath, obj) =>
  writeFile(targetPath, JSON.stringify(obj, null, 2), 'utf8');

async function createPackageFile() {
  const packageData = await readFile(
    resolve(packagePath, './package.json'),
    { encoding: 'utf8' }
  );

  // @ts-ignore
  const srcFolderAndFileNames = await getFolderFiles('/src')

  const subExportsMap = srcFolderAndFileNames.reduce((acc, name) => {
    const isFile = RegExp(/.(j|t)s/).test(name)
    const cleanName = name.split('.')[0]
    const key = './' + cleanName

    acc[key] = {
      types: './types/' + cleanName + (isFile ? '.d.ts' : '/index.d.ts'),
      import: './esm/' + (isFile ? `${cleanName}.js` : cleanName),
      default: './esm/' + (isFile ? `${cleanName}.js` : cleanName)
    }

    return acc
  }, {})

  const { scripts, devDependencies, ...packageOthers } =
    JSON.parse(packageData);
  
    const newPackageData = {
    ...packageOthers,
    private: false,
    typings: './types/index.d.ts',
    types: './types/index.d.ts',
    main: 'cjs/index.js',
    module: 'esm/index.js',
    exports: {
      ".": {
        "import": "./esm/index.js",
        "require": "./cjs/index.js"
      },
      ...subExportsMap,
      "./package.json": "./package.json"
    }
  };

  const targetPath = resolve(distPath, './package.json');

  await writeJson(targetPath, newPackageData);
  console.log(`Created package.json in ${targetPath}`);

  return srcFolderAndFileNames.map((name) => name?.split('.')[0])
}

async function includeFileInBuild(file) {
  const sourcePath = resolve(packagePath, file);
  const targetPath = resolve(distPath, basename(file));
  await copy(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function writeGitIgnore(ignorePaths) {
  if (ignorePaths.length === 0) return
  await writeFile(
    packagePath + '/.gitignore',
`
# Generated file. Do not edit directly.
${ignorePaths.map(p => p.startsWith('/') ? p : `/${p}`).join('/\n')}/
`,
  )
  console.log('Wrote new .gitignore')
}

async function run() {
  try {
    const files = await createPackageFile();
    await includeFileInBuild('./README.md');
    await writeGitIgnore(files || [])
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();