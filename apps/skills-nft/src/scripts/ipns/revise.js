import fs from 'fs'
import * as Name from 'w3name'

// get previous key
const bytes = await fs.promises.readFile('priv.key')
const name = await Name.from(bytes)

console.log('Name:', name.toString())
// e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt
