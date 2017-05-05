---
title: Vue 2.0生命周期与钩子
date: 2017-05-04 23:05:44
tags:   
    - Vue.js
    - javascript
    - summary
---

## Vue 2.0生命周期与钩子

Vue是通过一个构造函数Vue创建一个Vue的根实例启动,每个实例都包含了业务的处理逻辑(methods),数据模型(data)等等.每个实例也包括了完整的生命周期,从创建模版,初始化数据,编译模板,挂载dom,渲染,更新,销毁一系列过程,从创建到销毁的过程

<!-- more -->

![](https://cn.vuejs.org/images/lifecycle.png)

### beforeCreate

整个流程的最前端,这个时候data,el,methods还没有开始初始化,可以在这里加loading事件

ex:

```html
<div id="show">
    {{msg}}
</div>

<script>
    var vue = new Vue({
        el:'#show',
        data:{
            msg:'yzzting'
        },
        beforeCreate(){
            console.log('beforeCreate')
            console.log(this.data)
            console.log(this.$el)
        }
    })

</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505110037.png)

### create

这个时候初始化了data和methods,但是并没有在DOM上挂载,$el还未挂载,这里结束loading事件或者是在这里调用ajax

ex:

```html
<div id="show" ref="show">
    {{msg}}
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        created() {
            console.log('created')
            console.log(this.msg)
            console.log(this.$el)
            console.log(this.$refs.show)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505110838.png)

### beforeMount

完成了el初始化

ex:

```html
<div id="show" ref="show">
    {{msg}}
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        beforeMount() {
            console.log('beforeMount')
            console.log(this.msg)
            console.log(this.$el)
            console.log(this.$refs.show)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505121703.png)

这里可以看到msg值还没有被渲染到dom中,但vue挂载的根节点已经生成,下一步$mount函数都是基于这个阶段生成的根节点.这就是Virtual DOM ???

### mounted

完成所有挂载,refs组件属性方法的渲染也完成,到这个步骤Vue实例的创建全部完成,在这个过程之前$el的值是虚拟的节点

```html
<div id="show" ref="show">
    {{msg}}
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        mounted() {
            console.log('mounted')
            console.log(this.msg)
            console.log(this.$el)
            console.log(this.$refs.show)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505113119.png)

### beforeUpdate

在页面初始渲染视图之后，一旦监测到data发生变化，在变化的数据重新渲染视图之前会触发beforeUpdate钩子函数，这也是重新渲染之前最后修改数据的机会

ex:

```html
<div id="show" ref="show">
    {{msg}}

    <button @click="updateMsg">BeforeUpdate</button>
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        methods: {
            updateMsg() {
                this.msg = 'updateYzzting'
            }
        },
        beforeUpdate() {
            console.log('beforeUpdate')
            console.log(this.msg)
            console.log(this.$el)
            console.log(this.$refs.show.innerHTML)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505115152.png)

### update

在data发生变化渲染更新视图之后触发

ex:

```html
<div id="show" ref="show">
    {{msg}}

    <button @click="updateMsg">BeforeUpdate</button>
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        methods: {
            updateMsg() {
                this.msg = 'updateYzzting'
            }
        },
        updated() {
            console.log('Update')
            console.log(this.msg)
            console.log(this.$el)
            console.log(this.$refs.show.innerHTML)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505115516.png)

### beforeDestroy

清除vue实例与DOM的关联,调用destroy方法可以销毁当前组件.在销毁前,会触发beforeDestroy钩子函数

ex:

```html
<div id="show" ref="show">
    {{msg}}
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        beforeDestroy() {
            console.log('beforeDestroy')
            console.log(this.msg)
            console.log(this.$el)
        }
    })
</script>
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505120425.png)

在这一步实例还是可以调用的

### destroyed

Vue实例销毁后调用.调用后,Vue实例指示的所有东西都会解绑定,所有的事件监听器会被移除,所有的子实例也会被销毁.

ex:

```html
<div id="show" ref="show">
    {{msg}}

    <button @click="updateMsg">BeforeUpdate</button>
</div>

<script>
    var vue = new Vue({
        el: '#show',
        data: {
            msg: 'yzzting'
        },
        methods: {
            updateMsg() {
                this.msg = 'updateYzzting'
            }
        },
        destroyed() {
            console.log('Destroyed')
            console.log(this.msg)
            console.log(this.$el)
        }
    })
</script>
```

此时销毁实例后,再次调用updateMsg方法,无法在更新数据

![](http://7xp1k3.com1.z0.glb.clouddn.com/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE20170505121028.png)