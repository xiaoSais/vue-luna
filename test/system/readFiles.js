const readFiles = require('../../lib/system/readFiles')
const path = require('path')
const traverse = require('../../lib/system/traverse')
const _envPath = process.cwd()
let tt = traverse(path.join(_envPath, 'src'))

console.log(tt)
readFiles(tt).then(res => {
    console.log(res)
})