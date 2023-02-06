import { extractArgs } from '../../utils.js'
import { createFirebaseAdmin, uploadFile } from './common.js'

const args = extractArgs(process.argv)
console.log(`
ARGS
${JSON.stringify(args, null, 2)}
`)

if (!args.path) throw new Error('Missing path<string> arg')
if (!args.destination) throw new Error('Missing destination<string> arg')
if (!args.fileType) throw new Error('Missing fileType<string> arg')

const size = args.size || 1
// index exists, don't loop
if (args.index) {
  await uploadFile({
    path: `${args.path}/${args.index * 1000}.${args.fileType}`,
    destination: `${args.destination}/${args.index * 1000}.${args.fileType}`
  }).catch(console.error)
} else {
  const { storageRef: singletonStorageRef } = createFirebaseAdmin()
  for (let i = 1; i <= size; i++) {
    await uploadFile(
      {
        path: `${args.path}/${i * 1000}.${args.fileType}`,
        destination: `${args.destination}/${i * 1000}.${args.fileType}`
      },
      singletonStorageRef
    ).catch(console.error)

    i === size && process.exit()
  }
}

/*
// EXAMPLE USE

// LOOP
npx lerna run firebase:upload -- \
--path "./src/skills/1/metadata" \
--destination "1/metadata" \
--size 6 \
--fileType "json"

// SINGLE FILE
npx lerna run firebase:upload -- \
--path "./src/skills/1/metadata" \
--destination "1/metadata" \
--index 2 \
--fileType "json"
*/
