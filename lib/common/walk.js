const walk = require('acorn-walk')
const acorn = require('acorn')
module.exports = {
    /**
     * @author xiaosais
     * @method getAlias 
     * @description 获取webpack配置的alias解析
     * @param {String} dataUtf8 基于utf8编码的webpack基本文件
     * @return {Object} 返回结果数组
     */
    getAlias: (dataUtf8) => {
        const data = acorn.parse(dataUtf8, {sourceType: 'module'})
        return new Promise ((resolve, reject) => {
            try {
                walk.full(data, (node) => {
                    if(node.type === 'Property' && node.key.name === 'alias' && node.value.type === 'ObjectExpression') {
                        let tempNode = node
                        let keys = [], value = []
                        let result = {}
                        walk.full(tempNode, (node) => {
                            if(node.type === 'Property') {
                                if(node.key.value) keys.push(node.key.value)
                            }
                        })
                        walk.simple(tempNode, {
                            Literal(node) { value.push(node.value) }
                        })
                        if(keys.length) { 
                            keys.forEach((i,ind) => {result[i] = value[ind]})
                            resolve(result)
                        }
                    }
                })
            } catch(e) { reject(e) }
        })
    },

    /**
     * @description 获取script文件的components引用
     * @param {String} data 基于utf8编码的script文件
     * @return {Object} 返回结果数组
     */
    getComponents: (dataUtf8) => {
        const data = acorn.parse(dataUtf8, {sourceType: 'module'})
        return new Promise ((resolve,reject) => {
            try {
                let importDeclearCase = [], componentsUseCase = []
                walk.full(data, (node) => {
                    //筛选出所有的import语句
                    if(node.type === 'ImportDeclaration') {
                        if(node.specifiers.length) {
                            importDeclearCase.push({
                                value: node.specifiers[0].local.name,
                                path: node.source.value
                            })
                        }
                    }
                    if(node.type === 'Property') {
                        if(node.key.name === 'components') {
                            const comArray = node.value.properties
                            componentsUseCase = comArray.map( i => {
                                //兼容require引入
                                let obj = {}
                                if(i.value.type === 'CallExpression') {
                                    if(i.value.callee.name === 'require') {
                                        obj['key'] = i.key.name
                                        obj['value'] = i.key.name
                                        obj['path'] = i.value.arguments[0].value
                                    }
                                } else {
                                    obj['key'] = i.key.name
                                    obj['value'] = i.value.name
                                }
                                return obj
                            })
                        }
                    }
                })
                const result = componentsUseCase.map(i => {
                    if(i.path) {return i}
                    else {
                        const importObj = importDeclearCase.filter(j => {return j.value === i.value})
                        if(importObj.length) {
                            return Object.assign(i, importObj[0])
                        } else return i;
                    }
                })
                resolve(result)  
            } catch (e) { reject(e) }
        })
    },

    /**
     * @author xiaosais
     * @method getGlobal 
     * @description 获取全局变量配置
     * @param {String} dataUtf8 基于utf8编码的定义全局变量的js文件
     * @return {Object} 返回结果数组
     */
    getGlobal: (dataUtf8) => {
        const data = acorn.parse(dataUtf8, {sourceType: 'module'})
        return new Promise((resolve, reject) => {
            try {
                let vueImportNode = data['body'].filter(node => {
                    return node.type === 'ImportDeclaration' && node.source.value === 'vue'
                })
                const vueName = vueImportNode[0].specifiers[0].local.name
                let importCase = [] 
                let componentsCase = []
                walk.full(data, (node) => {
                    if(node.type === 'ImportDeclaration') {
                        if(node.specifiers.length) {
                           importCase.push({
                                value: node.specifiers[0].local.name,
                                path: node.source.value
                            }) 
                        }
                    }
                    if(node.type === 'CallExpression') {
                        if(node.callee.object && node.callee.object.name === vueName) {
                            if(node.callee.property.name === 'component') {
                                const argNode = node.arguments
                                if(argNode[1] && argNode[1].type === 'CallExpression') {
                                    componentsCase.push({
                                        key: argNode[0].value,
                                        value: argNode[0].value,
                                        path: argNode[1].arguments[0].value
                                    })
                                }
                                if(argNode[1] && argNode[1].type === 'Identifier') {
                                    componentsCase.push({
                                       key: argNode[0].value,
                                       value: argNode[1].name
                                    })                                        
                                }
                            }
                        }
                    }
                })
                const result = componentsCase.map(i => {
                    if(i.path) return i
                    else {
                        const importObj = importCase.filter(j => j.value === i.value)
                        if(importObj.length) {
                            return Object.assign(i, importObj[0])
                        } else return i;
                    }
                })
                resolve(result)
            } catch(e) { reject(e) }
        })
    }
}
