import { extractArgs } from '../../utils.js'
import { uploadFile } from './common.js'

const args = extractArgs(process.argv)
console.log(`
ARGS
${JSON.stringify(args, null, 2)}
`)

if (!args.path) throw new Error('Missing path<string> arg')
if (!args.destination) throw new Error('Missing destination<string> arg')

uploadFile({ path: args.path, destination: args.destination })
  .then(() => process.exit())
  .catch(console.error)
