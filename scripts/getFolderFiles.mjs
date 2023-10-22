// @ts-check
import { readdir } from 'fs/promises'

/**
 * getFolderFiles
 * @param {string} folderName - folder name containing source files
 * @param {string[]} ignoreList - list of string names to ignore
 * @returns { Promise<string[]> } - promised string list of files/folder names
 */
export const getFolderFiles = async (folderName = '/src', ignoreList = []) => {
  const fileNames = (await readdir(process.cwd() + folderName)) || []
  
  return fileNames.reduce((acc, name) => {
  if (ignoreList.concat(['index.ts', 'index.js']).includes(name)) return acc

  // @ts-ignore
  acc.push(name)
  return acc
}, [])}