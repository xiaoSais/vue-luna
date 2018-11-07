# vue-luna
一个基于Echats的Vue组件间依赖关系分析工具

## Install

全局安装

```
  npm install vue-luna -g
```

## Usage

```
 -- cd yourProject
 -- luna
```

## Notice

### 支持的组件引入方式

* 在组件内通过import引入（加后缀名）
  ```
  //header.vue
  <script>
    import A from './components/BB.vue'  
  </script>
  ```
* 不加.vue后缀名引入
  ```
  //header.vue
  <script>
    import A from './components/BB'  
  </script>
  ```
* 在组件内抽出js单文件引入
  ```
  //header.vue
  <script src="./recomdule/a.js"></script>

  //a.js
  import A from './components/BB.vue'
  ```

### 不支持的组件引入方式

很遗憾Luna暂时不支持 webpack alias 解析模块，因此下面的引入方式Luna是无法识别的：
```
//无效的组件引入方式
import components from '@/axx,vue'
```





## Pages and Components

该工具如果分析出某个.vue文件不被任何其他组件所引用，那么默认它为页面级组件，如果被其他组件所引用过，那么它被认为是vue组件

## ToDo

* 支持自定义命令参数
* 更加友好的界面展示
* <s>扩展核心功能，支持不加文件名分析</s> (已完成)
* <s>支持动态查找某个组件的被引用关系</s> (已完成)