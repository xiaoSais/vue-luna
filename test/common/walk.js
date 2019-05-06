const fs = require('fs')
const walk = require('../../lib/common/walk')
const util = require('../../lib/common/util')
const _envPath = process.cwd()
const path = require('path')
fs.readFile('webpack.config.raw.js', 'utf8', (err, data) => {
    walk.getAlias(data).then(res => {
        console.log(res)
    }).catch(err => { console.log(err) })
})

fs.readFile(path.join(_envPath, 'src/views/roomReview/ModalReviewRoomContent.vue'), 'utf8', (err, data) => {
    const script = util.filterData(data).script
    walk.getComponents(script).then(res => {
        console.log(res)
    }).catch(err => { console.log(err) })
})


