
const _envPath = process.cwd()
const fs = require('fs')
const walk = require('./walk')
const path = require('path')
/**
 * @method getConfig 
 * @description 读取Luna的配置文件
 * @return {Object | boolean} 如果读取到返回读取对象，否则返回false
 */

const getConfig = async () => {
    try {
        const config = JSON.parse(fs.readFileSync(`${_envPath}/luna.json`, 'utf8'))
        const result = { dir: config }
        for(let i of Object.keys(config)) {
            const data =  fs.readFileSync(path.join(_envPath, config[i]), 'utf8')
            switch(i) {
                case 'webpack_alias_path':{
                    result.alias = await walk.getAlias(data)
                    break;
                }
                case 'vue_entry_path': {
                    result.global = await walk.getGlobal(data)
                    break;
                }
            }
        } return result;
    } catch(e) {
       return false
    }
} 
module.exports = getConfig