// @ts-check
import { readdir } from 'fs/promises'

const DEFAULT_IGNORE_LIST = [
  // ignore index files
  /index.(t|j|mj)sx?/,
  // ignore cosmos decorator files
  /(|[a-z]\w+).decorator.(t|j|mj)sx?/,
  // ignore *.d.ts --> e.g decl.d.ts
  /(|[a-z]\w+).d.ts/,
  // ignore version.json files
  /(|[a-z]|[A-Z])\w+.json/,
  // ignore jest tests
  /__tests__/,
  // ignore jest mocks
  /__mocks__/,
  // ignore cosmos fixtures
  /fixtures?/,
  // ignore asset folders
  /assets/,
  // ignore dev folders
  /dev/
]

/**
 * getFolderFiles
 * @param {string} folderName - folder name containing source files
 * @param {(string | RegExp)[]} ignoreList - list of string names to ignore
 * @returns { Promise<string[]> } - promised string list of files/folder names
 */
export const getFolderFiles = async (folderName = '/src', ignoreList = []) => {
  const fileNames = (await readdir(process.cwd() + folderName)) || []
  
  return fileNames.reduce((acc, name) => {
  const ignore = ignoreList.concat(DEFAULT_IGNORE_LIST).some(ignoreVal => {
    if (typeof ignoreVal === 'string') {
      return ignoreVal?.includes(name)
    } else {
      return ignoreVal?.test(name) 
    }
  })

  if (!!ignore) {
    return acc
  }

  // @ts-ignore
  acc.push(name)
  return acc
}, [])}