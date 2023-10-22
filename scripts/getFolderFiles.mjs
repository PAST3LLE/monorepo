// @ts-check
import { readdir } from 'fs/promises'

export const getFolderFiles = async (folderName = '/src') => {
  const fileNames = (await readdir(process.cwd() + folderName)) || []
  
  return fileNames.reduce((acc, name) => {
  if (name.includes('index')) return acc

  // @ts-ignore
  acc.push(name)
  return acc
}, [])}