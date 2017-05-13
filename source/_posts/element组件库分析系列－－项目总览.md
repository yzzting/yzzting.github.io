---
title: element组件库分析系列--项目总览
date: 2017-05-12 23:58:17
tags:
    - javascript
    - Vue.js
---

# element组件库分析系列--项目总览

打算写一个系列的文章分析饿了么出品的这个Vue组件库.这个库算是在Vue2.0里最好的一个库,常用组件功能丰富,生态齐全.....

<!--more-->

## 项目结构

```bash
├── build
├── CHANGELOG.en-US.md
├── CHANGELOG.zh-CN.md
├── components.json
├── element_logo.svg
├── examples
├── FAQ.md
├── lerna.json
├── LICENSE
├── Makefile
├── package.json
├── packages
├── README.md
├── src
│   ├── index.js
│   ├── locale
│   ├── mixins
│   ├── transitions
│   └── utils
├── test
│   └── unit
└── yarn.lock
```

有别于其他组件库的项目结构,element把每一个组件都放在了packages这个文件夹里,在src里入口文件引入所有组件.这样的组织结构每个插件亦可单独分布.

在src目录下分别有locale,mixins,transitions,utils

```bash

├── src
│   ├── index.js //组件的入口文件
│   ├── locale //国际化的语言库,使用[vue-i18n](https://github.com/kazupon/vue-i18n)
│   ├── mixins 
│   ├── transitions
│   └── utils //一些通用的工具类

```

### Mixins

```bash

├── emitter.js
├── locale.js
└── migrating.js

```

#### emitter.js

先说emitter.js.总所周知在Vue2.0中删除了$dispatch和$broadcard方法,所以element将这两个方法重新实现了一次,采用mixin形式引入每个组件中

```js

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
        //在符合条件的组件上触发事件
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      //持续找到符合条件的组件
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      //寻找父级，如果父级不是符合的组件名，则循环向上查找
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```

#### broadcast

broadcast函数接收3个参数,componentName组件名,eventName事件名,数据源,从源码上看函数直接向子组件传递事件,调用指定子孙组件的事件.当找到指定的组件后触发事件,不会触发该组件的下一级组件事件.而在Vue1.x中 $broadcast 是这样解释的

> 广播事件，通知给当前实例的全部后代。因为后代有多个枝杈，事件将沿着各“路径”通知。每条路径上的通知在触发一个监听器后停止，除非它返回 true。

#### dispatch

同样的dispatch接收3个参数,componentName组件名,eventName事件名,数据源.通过遍历寻找父级,派发事件

### Utils

占坑,会新开一篇文章单独讲

### CSS

顺带说一下CSS部分.element并没有像其他组件库一样使用SASS,LESS这类预处理器,而是才用自家开发的基于PostCSS的[postcss-salad](https://github.com/ElemeFE/postcss-salad),并使用BEM命名方式

ex:

```css
.el-input-group__append,
.el-input-group__prepend {
  background-color: #fbfdff;
  color: #97a8be;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  padding: 0 10px;
  width: 1%;
  white-space: nowrap
}
```
用户还可以通过[theme-default](https://github.com/ElementUI/theme-default)这个工具自己定义整个组件库的样式,进行二次开发

我自己的理解,这样将CSS单独作为一个包发布,引入整个包也可以包含全部的样式,单独安装某个组件也可以通过安装主题包引入样式.

### End

下一次分析utils里一些常见的工具类,看看elme的是如何实现






