
const path = require('path')
const {traverse, dealUtf8, fileExist} = require('./files')
const _envPath = process.cwd()
const REG = require('../common/regex')
const walk = require('../common/walk')
const getConfig = require('../common/getConfig')
const util = require('../common/util')

/**
 * @author xiaosais
 * @description luna的入口文件，执行目录下js分析、摘取等核心操作
 * @method entry
 * @return {Array} 返回分析之后的结果[{name: '.../xx.vue', components: [{}, {}]]
 */
const entry = async (dir) => {
    let result = []
    const list = traverse(path.join(_envPath, dir))
    const config = await getConfig()
    const globalComponents = config && config.global ? fileExist(config.dir['vue_entry_path'], config.global, config.alias) : []
    console.log(globalComponents)
    for (const i of list) {
        const data = await util.readFile(i)
        const splitData = dealUtf8(i, data)
        if(splitData) {
            let [script, template] = [splitData.script, splitData.template]
            const res = await walk.getComponents(script)
            const componentsAllPath = fileExist(i, res, config.alias)
            const hasGlobal = globalComponents.filter(k => {
                const isSome = componentsAllPath.some(m => JSON.stringify(m) === JSON.stringify(k))
                const notPugReg = new RegExp(REG.GLOBAL_MATCH_NORMAL + util.toKebabCase(k.key),"gi")
                const pugReg = new RegExp(REG.GLOBAL_MATCH_PUG + util.toKebabCase(k.key), "gi")
                return !isSome && (template.match(notPugReg) || template.match(pugReg))
            })
            const name = path.basename(i)
            const path1 = i.replace(/.*src/gi, '')
            const components = [...componentsAllPath, ...hasGlobal].filter(m => m.path).map( j => {
                return {name: path.basename(j.path), path: j.path.replace(/.*src/gi, '')}
            })
            result.push({name: name, path: path1, children: components})
        }
    }
    return result
}

module.exports = { entry }