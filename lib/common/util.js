const REG = require('./regex')
const fs = require('fs')
module.exports = {
    
    /**
     * @method filterData
     * @description 将vue文件的script和template分离
     * @param {String} vueData vue文件的utf8格式文件
     * @return {Object} 返回由结果拼成的对象
     */
    filterData: (vueData) => {
        const scriptHasTag = vueData.match(REG.GET_SCRIPT) ? vueData.match(REG.GET_SCRIPT)[0] : ''
        const templateHasTag = vueData.match(REG.GET_TEMPLATE) ? vueData.match(REG.GET_TEMPLATE)[0] : ''
        return {
            script: scriptHasTag.replace(/\/r\/n/g,'').replace(/<\/script>/g, '').replace(/<script.*>/, ''),
            template: templateHasTag
        }
    }, 
    
    /**
     * @method toKebabCase
     * @description 将名字由驼峰式转化成KebabCase类型
     * @param {String} str 驼峰式名字字符串，默认变量没有特殊符号
     * @return {String} 返回KebabCase的类型的字符串
     */
    toKebabCase: (str) => {
        if(str.match(REG.TO_KEBAB_CASE)) {
            return str.match(REG.TO_KEBAB_CASE).join('-').toLowerCase()
        } else return ''
    },

    /**
     * @method readFile
     * @description 封装promise类型的读文件方法
     * @param {String} path 文件路径
     * @return {Promise}
     */
    readFile: (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if(err) reject(err)
                else resolve(data)
            })
        })
    },

    /**
     * @method splitPage 
     * @description 分离页面和组件
     * @param {Array} allReault 所有结果数据
     * @return {Object} {pages: [], components: [], all: []}
     */
    splitPage: (allResult) => {
        let pages = []
        let components = []
        let all = allResult
        if(Array.isArray(allResult) && allResult.length) {
            allResult.forEach((i, idx) => {
                let target = false;
                const current = JSON.stringify(i)
                for(let j =0; j<allResult.length; j++) {
                    if(j !== idx) {
                        const compare = JSON.stringify(allResult[j]);
                        if(compare.indexOf(current) !== -1) {
                          target = true
                          break 
                        }
                    }
                }
                target ? components.push(i) : pages.push(i)    
            })
        }
        return {pages, components, all}
    }
}