import fs from 'fs'
import * as Name from 'w3name'

// get previous key
const bytes = await fs.promises.readFile('priv.key')
const name = await Name.from(bytes)

console.log('KEY:', name.toString())
