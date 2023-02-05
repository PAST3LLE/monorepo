import fs from 'fs'
import * as isIPFS from 'is-ipfs'
import { argv } from 'process'
import * as Name from 'w3name'

const [IPFS_HASH_ARG] = argv.slice(2)
console.log('IPNS w3name PUBLISH -- FOUND ARG HASH:', IPFS_HASH_ARG)

if (!isIPFS.cid(IPFS_HASH_ARG.replace('/ipfs/', ''))) throw new Error('INVALID CID DETECTED')

const name = await Name.create()
// Store the signing key to a file for use later
await fs.promises.writeFile('priv.key', name.key.bytes)

const value = IPFS_HASH_ARG.match('/ipfs/') ? IPFS_HASH_ARG : '/ipfs/' + IPFS_HASH_ARG
const revision = await Name.v0(name, value)

await Name.publish(revision, name.key)
