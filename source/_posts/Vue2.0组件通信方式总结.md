---
title: Vue2.0组件通信方式总结
date: 2017-04-23 00:41:00
tags:
    - Vue.js
    - javascript
    - summary

---

## Vue 2.0 组件通信方式总结

最近在写一个基于Vue的markdown[编辑器](https://github.com/yzzting/vue-markdown-editor),在项目里难免有不同组件之间的数据共享,今天写这边文章总结一下Vue中几种组件通信方式.首先,列举3种通信情景

* 父组件向子组件通信
* 子组件向父组件通信
* 平行组件之间通信

<!-- more -->

> 文章的demo基于Vue-cli

### 父组件向子组件通信

先说第一种情景,直接上代码,Hello.vue

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props:['msg']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

```

在父组件中引入Hello组件,在标签中给msg赋值

``` js
<template>
  <div id="app">
    <hello msg='yzzting'></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
</style>

```

这个时候在浏览器中不出意外的话会出现会出现 yzzting （原谅我偷懒没有截图

可以看到父组件成功将msg传给了子组件,所以你大可在父组件中对msg这个数据进行你所想的想法

1.先在子组件定义props
2.父组件中引入子组件,并在子组件标签中添加props定义的属性
3.把你所想的数值赋值给该属性

如果想要传递的是方法,或者说父组件调用子组件的方法,则可以用ref,通过ref可以直接访问子组件,官方的定义是:

> ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例

上代码 父组件App.vue

```js
<template>
  <div id="app">
    <hello msg='yzzting' ref="hello"></hello>
    <button @click="father"></button>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  },
  methods:{
    father() {
      this.$refs.hello.yzz()
    }
  }
}
</script>

<style>
</style>

```

子组件 Hello.vue

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props:['msg'],
  methods:{
    yzz() {
      console.log('我是通过ref调用的')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

```

不出意外的话,应该会有下面这种效果

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170423012317.png)

### 子组件向父组件通信

还是直接上代码吧

Hello.vue

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="sengMsg">给父组件传值</button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props:['msg'],
  methods:{
    yzz() {
      console.log('我是通过ref调用的')
    },
    sengMsg() {
      this.$emit('sengYzz','hello yzzting!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

```

在Hello中定义一个方法,并使用$emit监听一个自定义事件

vm.$emit( event, […args] )

参数：

{string} event
[...args]

触发当前实例上的事件。附加参数都会传给监听器回调。

这是定义

然后在父组件中监听这个自定义事件

App.vue

```js
<template>
  <div id="app">
    <hello msg='yzzting' ref="hello" v-on:sengYzz="showMsg"></hello>
    <button @click="father"></button>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  },
  methods:{
    father() {
      this.$refs.hello.yzz()
    },
    showMsg(data) {
      console.log(data)
    }
  }
}
</script>

<style>
</style>

```
不出意外控制台会输出hello yzzting！

ok！子组件也向父组件成功传值了

这种情景主要是通过自定义事件来实现,使用$emit就可以啦

### 平行组件之间通信

这种情景其实比较特殊,google出来很多方法都是直接使用Vuex,但是我在我这个markdown编辑器的项目中遇到过一个问题,在计算属性computed中获取Vuex中转的数据，可在data中却无法调用,好像是data比computed先生成所导致... 所以不得不找一种方法取代Vuex

还记得上面说的$emit么,通过他也可以在平行组件中传递数据

首先 新建一个eventsBus.js

```js
import Vue from 'vue'

export default new Vue
```

然后在Hello中使用$emit定义一个自定义事件

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="sengMsg">给父组件传值</button>
    <button @click="brother">给兄弟传值</button>
  </div>
</template>

<script>

import bus from '../assets/eventsBus'

export default {
  name: 'hello',
  props:['msg'],
  methods:{
    yzz() {
      console.log('我是通过ref调用的')
    },
    sengMsg() {
      this.$emit('sengYzz','hello yzzting!')
    },
    brother() {
      bus.$emit('brotherYzz','hello brother!!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

```

新建一个brother.vue 写入

```js
<template>
  <div class="hello">
    <h1>{{ data }}</h1>
  </div>
</template>

<script>

import bus from '../assets/eventsBus'

export default {
  name: 'brother',
  data() {
      return {
          data:''
      } 
  },
  mounted(){
      bus.$on('brotherYzz',(data) => {
          this.data = data
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

```

不出意外的话,可以在浏览器看到hello brother!!

ok！ 第三种情景也成功传值了

其实根据这个思路我们可以把需要传递的数值传给同个父组件,再由父组件进行分发...

当然,还有大杀器Vuex,我在markdown编辑器这个项目里大量使用,具体就不说啦,网上好多比我说得好的资料

参考资料

[Vue2.0组件之间通信](http://www.jianshu.com/p/d946bd7c26f4)

[Vue2.0子父组件通信](http://www.jianshu.com/p/2670ca096cf8)