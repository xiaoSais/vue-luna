/**
 * 核心类Luna
 * @module Luna
 * @author sai.shi
 * @constructor {String} dir 资源路径
 * @method getTree 
 * @description 获取Echarts结构的对象
 * @return {Object} 
 */
const fs = require('fs')
const path = require('path')
const _envPath = process.cwd()

class Luna {
  constructor(dir) {
    this.dir = path.resolve(path.join(_envPath, dir))
    this.all = []
    this.pages = []
    this.components = [] 
  }
  
  getTree() {
    return new Promise(resolve => {
      _recursePath.call(this, this.dir, () => {
        resolve(_recurseTree.call(this, (this.all)))
      })
    })
  }
}

/**
 * @method _recursePath 
 * @description 递归遍历目录下的.vue文件
 * @param {String} pagesPath 资源路径
 * @param {Function} callback 回调 
 */
const _recursePath = function (pagesPath, callback) {
  const files =  fs.readdirSync(pagesPath)
  files.forEach((i) => {
    const fileState = fs.statSync(path.join(pagesPath, i))
    const fileName = path.join(pagesPath, i)
    if (fileState.isDirectory()) {
      _recursePath.call(this, fileName)
    } else {
      if(fileName.indexOf('.vue') !== -1) {
        const fileData = fs.readFileSync(fileName, 'utf8')
        this.all.push({ name: fileName, module: fileData.match(/import.*?\.vue/g)})
      }
    }
  })
  callback && callback.call()
}

/**
 * @method _parseName 
 * @description 去除冗余信息,只保留文件名
 * @param {Array} mapArray 映射数组
 * @return {Array} 返回树结构的数组
 */
const _parseName = function(mapArray) {
  return mapArray.map (i => {
    let name = path.parse(i.name).base
    let children = []
    if(i.module) {
      i.module.forEach(j => {
        children.push({name: j.match(/.+\/(.+)$/)[1]})
      })
    }
    return children.length ? {name: name, children: children} : {name: name}
  })
}

/**
 * @method _recurseTree 
 * @description 获取递归树
 * @param {Array} originTree 原始树
 * @return {Object} 返回页面以及组件树对象
 */
const _recurseTree = function(originTree) {
  const formateTree = _parseName(originTree)
  this.all = []
  
  function _recurseItem(item, tree) {
    if(!item.children) { return item }
    else {
      for(let i = 0; i < item.children.length; i++) {
        tree.forEach(j => {
          if(j.name === item.children[i].name) {
            item.children[i] = j 
          }
          _recurseItem(item.children[i], tree)
        })
      }
      return item
    }
  }
  
  formateTree.forEach(i => {
    this.all.push(_recurseItem(i, formateTree))
  })
  
  /**
   * @description 筛选出根节点/页面以及组件节点
   */
  this.all.forEach((i,inx) => {
    const current = JSON.stringify(i);
    let target = false;
    for(let j = 0; j<this.all.length; j++) {
      if (j !== inx) {
        const compare = JSON.stringify(this.all[j]);
        if(compare.indexOf(current) !== -1) {
          target = true;
          break;
        }
      }
    }
    target ? this.components.push(i) : this.pages.push(i)
  })
  
  /**
   * @method _getParent 查找目标组件被引用关系
   * @param {Object} 单个树对象
   * @param {String} 要查找的目标元素 
   * @param {Array} 缓存结果数组即该目标元素的所有父节点
   */
  function _getParent(item, target, arr) {
    if(item.children) {
      for(let i = 0; i<item.children.length; i++) {
        if(item.children[i].name === target) {
          arr.indexOf(item.name) === -1 ? arr.push(item.name) : arr;
        }
        if(item.children[i].children) _getParent(item.children[i], target, arr)
      }
    }
  }

  /**
   * @description 获取所有元素的被引用父节点
   * @method _getAllParent 
   * @param {Array} 所有树集合组成的数组
   * @return {Array} 返回以结果数组
   */
  function _getAllParent(arr) {
    let allReverse = {};
    for(let i =0; i<arr.length; i++) {
      allReverse[arr[i].name] = []
      for(let j =0; j<arr.length; j++) {
        if(i !== j) {
          _getParent(arr[j], arr[i].name, allReverse[arr[i].name])
        }
      }
    }
    return allReverse
  }
  
  /**
   * @description 转化成name-children的形式，便于复用_recurseItem函数
   */
  let parentNodeList = _getAllParent(this.all)
  let reverseTreeAll = []
  for(let i in parentNodeList) {
    if(parentNodeList[i].length) {
      reverseTreeAll.push({name: i, children: []})
      for(let j = 0; j<parentNodeList[i].length; j++) {
        reverseTreeAll[reverseTreeAll.length-1].children.push({name: parentNodeList[i][j]})
      }
      
    } else reverseTreeAll.push({name: i})
    
  }
  let reverseTree = [];
  reverseTreeAll.forEach(i => {
    reverseTree.push(_recurseItem(i, reverseTreeAll))
  })

  return {
    all: this.all,
    pages: this.pages,
    components: this.components,
    reverseTree: reverseTree
  }
}

module.exports =  Luna