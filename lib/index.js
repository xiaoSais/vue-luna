
const trees = require('./system/trees')

/**
 * @module Luna类
 * @author xiaosais
 * @description 入口文件
 */
class Luna {
    constructor(dir) {
        this.dir = dir
    }
    async getResult() {
        return await trees.call(this, this.dir)
    }
}

// let la = new Luna('src').getResult().then(res => {
//     console.log(res.pages[0])
// })
module.exports = Luna