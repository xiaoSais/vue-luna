const fs = require('fs')
const path = require('path')
const util = require('../common/util')
const _envPath = process.cwd()
let allFiles = []

/**
 * @method traverse
 * @author sai.shi
 * @description luna文件遍历模块
 * @return 返回目标目录下所有的文件名组成的数组
 */
const traverse = (dir) => {
    const FILE_PATH = dir
    const files = fs.readdirSync(FILE_PATH)
    files.forEach( i=> {
        const fileName = path.join(FILE_PATH, i)
        const fileState = fs.statSync(fileName)
        fileState.isDirectory() ? traverse(fileName) : allFiles.push(fileName)
    })
    return allFiles
}

/**
 * @method dealUtf8 
 * @param {String} file 文件名
 * @deprecated 摘取tempalte和script文件返回一个对象
 * @return {Object}
 */
const dealUtf8 = (file, data) => {
    const baseName = path.basename(file)
    if(baseName.indexOf('.vue') !== -1) {
        return util.filterData(data)
    }else return false   
}

/**
 * @method fileExist 
 * @description 判断某个文件是否存在，存在的话补全路径的名字
 * @param {String} dir 当前文件路径
 * @param {Array} pathArray 当前文件的摘取的结果，未补全文件名
 * @param {Array} aliasObj alias对象 
 * @return {String | Boolean} 存在的话返回补全后的名字，否则返回false
 */

const fileExist = (dir, pathArray, aliasObj) => {
    const result = []
    pathArray.forEach(i => {
        let fileAllPath
        let isAlias = false
        if(i.path) {
            if(aliasObj) {
                for(let j of Object.keys(aliasObj)) {
                    if(i.path.startsWith(j)) {
                        fileAllPath = path.join(_envPath, aliasObj[j], i.path.replace(j, ''))
                        isAlias = true
                        break
                    }
                }
            }
            if(!isAlias) {
                fileAllPath = dir.indexOf(_envPath) !== -1 ? path.join(dir, '..', i.path) : path.join(_envPath, dir, i.path)
            }
            if(fs.existsSync(fileAllPath)) {
                i.path = fileAllPath
                result.push(i)
            } else {
                if(fs.existsSync(fileAllPath + '.vue')) {
                    i.path = fileAllPath + '.vue'
                    result.push(i)
                }
            }
        } else result.push(i)
    })
    return result
}
module.exports = {traverse, dealUtf8, fileExist}