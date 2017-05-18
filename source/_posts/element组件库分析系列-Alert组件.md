---
title: element组件库分析系列--Alert组件
date: 2017-05-17 23:43:24
tags:
    - Vue.js
    - javascript
---

## element组件库分析系列--Alert组件

开始分析第一个组件--Alert组件

<!--more-->

## Template

```html
  <transition name="el-alert-fade">
    <div class="el-alert" :class="[ typeClass ]" v-show="visible">
      <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
        <slot>
          <p class="el-alert__description" v-if="description">{{ description }}</p>
        </slot>
        <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
```

从结构上看最外层用了Vue的[transition](https://cn.vuejs.org/v2/guide/transitions.html)组件,通过name给予entering/leaving状态.实现CSS动画的平滑过渡.里层结构通过属性列表和事件列表分析更容易理解

| 参数         | 说明      | 类型  | 可选值 | 默认值 |
| :--------   | --------:        | :--: | :--: | :--: |
| title       | 标题，必选参数                   |  string    | — | — |
| type        | 主题                           |  string    | success/warning/info/error | info |
| description | 辅助性文字也可通过默认 slot 传入    |  string    | — | — |
| closable    | 是否可关闭                       |  boolean  | — | true |
| close-text  | 关闭按钮自定义文本                |  string    | — | — |
| show-icon   | 是否显示图标                     |  boolean   | — | false |

首先最外层 `<div class="el-alert" :class="[ typeClass ]" v-show="visible">` typeClass对应了type属性,element定义了4种不同的alert主题,visible控制alert组件的显示与隐藏

对应的close方法

```js
data() {
    return {
    visible: true
    };
},

methods: {
    // 组件调用时,可传入一个回调函数
    close() {
    this.visible = false;
    this.$emit('close'); //监听事件
    }
},
```

```html
<i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
```

icon样式,iconClass控制icon图标样式,isBigIcon让图标更大. v-if="showIcon" 对应属性 show-icon ,这个属性并不是close button 而是文案前面的icon图标 默认隐藏

iconClass和isBigIcon分别通过计算属性得到

```js
  iconClass() {
    return TYPE_CLASSES_MAP[this.type] || 'el-icon-information';
  },

  isBigIcon() {
    return this.description ? 'is-big' : '';
  },
```
这里的TYPE_CLASS_MAP是alert类型的数组,通过type属性,选择对应的Css类名

```js
  const TYPE_CLASSES_MAP = {
    'success': 'el-icon-circle-check',
    'warning': 'el-icon-warning',
    'error': 'el-icon-circle-cross'
  };
```


```html
<span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
```
对应title参数,alert标题,必选项,默认值为true

```html
<slot>
  <p class="el-alert__description" v-if="description">{{ description }}</p>
</slot>
```
辅助性的描述文字,更好的描述alert组件.

```html
 <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
 ```
close button标签,如果定义了closeText则close icon会显示为自定义的closeText. closable控制按钮的显隐.绑定单击事件,触发close()

## End
