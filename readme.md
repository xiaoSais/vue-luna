# vue-luna
一个基于Echats的Vue组件间依赖关系分析工具

## Install

全局安装

```
  npm install vue-luna -g
```

## Usage

进入到项目目录下，执行luna命令，会自动分析当前目录src下所有Vue组件的依赖关系，并弹出浏览器进行展示

## Notice

默认所有的vue模块都是通过 import 引入的，并且该组件引入时保留该组件的文件名，下面是一个可以分析的有效引入

```
import A from './components/block.vue'
```

如果某个组件被引入时没有保留文件名，并且没有在其他地方被引入，例如：

```
import B from './components/block'
```

那么block.vue文件不能被识别为组件，而是被识别为页面，同时也会丢失该文件的依赖关系

## Pages and Components

该工具如果分析出某个.vue文件不被任何其他组件所引用，那么默认它为页面级组件，如果被其他组件所引用过，那么它被认为是vue组件

## ToDo

* 支持自定义命令参数
* 更加友好的界面展示
* 扩展核心功能，支持不加文件名分析
* 支持动态查找某个组件的被引用关系 (已完成)