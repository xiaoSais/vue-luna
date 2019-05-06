const { entry } = require('./core')
const util = require('../common/util')

/**
 * @description 单个数据递归
 * @param {Object} one 单个数组
 * @param {Array} all 所有数据
 * @param {Array} result 暂存结果，防止爆栈
 * @return {Object} 返回递归后的单个数据
 */
const _recurseOne = (one, all, result) => {
    if(!one.children || !one.children.length) return one
    else {
        for(let i = 0; i < one.children.length; i++) {
            const hasResult = result.filter(k => k.path === one.children[i].path)
            if(hasResult.length) {
                one.children[i] = hasResult[0]
            } else {
                all.forEach(j => {
                    if(j.path === one.children[i].path) { one.children[i] = j }
                    _recurseOne(one.children[i], all, result)
                })
            }
        }
        return one
    }
}

/**
 * @description 获取递归🌲
 * @method trees 
 * @return 返回Echarts结构的树形图
 */
const trees = async (dir) => {
    let all = await entry(dir)
    let result = []
    all.forEach(i => {result.push(_recurseOne(i, all, result))})
    return util.splitPage(result)
}

module.exports = trees
