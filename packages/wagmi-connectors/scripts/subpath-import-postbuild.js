/* eslint-disable no-console */
const { resolve, join, basename } = require('path');
const { readFile, writeFile, copy } = require('fs-extra');
const packagePath = process.cwd();
const distPath = join(packagePath, './dist');

const writeJson = (targetPath, obj) =>
  writeFile(targetPath, JSON.stringify(obj, null, 2), 'utf8');

async function createPackageFile() {
  const packageData = await readFile(
    resolve(packagePath, './package.json'),
    'utf8'
  );
  const { scripts, devDependencies, ...packageOthers } =
    JSON.parse(packageData);
  const newPackageData = {
    ...packageOthers,
    private: false,
    typings: './types/index.d.ts',
    types: './types/index.d.ts',
    main: './cjs/index.js',
    module: './index.js',
    exports: {
      ".": {
        "import": "./index.js",
        "require": "./cjs/index.js"
      },
      "./IFrameConnector": {
        "types": "./types/IFrameConnector/index.d.ts",
        "default": "./IFrameConnector"
      },
      "./LedgerHIDConnector": {
        "types": "./types/LedgerHIDConnector/index.d.ts",
        "default": "./LedgerHIDConnector"
      },
      "./LedgerIFrameConnector": {
        "types": "./types/LedgerIFrameConnector/index.d.ts",
        "default": "./LedgerIFrameConnector"
      },
      "./Web3AuthConnector": {
        "types": "./types/Web3AuthConnector/index.d.ts",
        "default": "./Web3AuthConnector"
      },
      "./package.json": "./package.json"
    },
  };

  const targetPath = resolve(distPath, './package.json');

  await writeJson(targetPath, newPackageData);
  console.log(`Created package.json in ${targetPath}`);
}

async function includeFileInBuild(file) {
  const sourcePath = resolve(packagePath, file);
  const targetPath = resolve(distPath, basename(file));
  await copy(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function run() {
  try {
    await createPackageFile();
    await includeFileInBuild('./README.md');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();