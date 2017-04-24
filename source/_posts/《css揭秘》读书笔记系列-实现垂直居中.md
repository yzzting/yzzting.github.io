---
title: 《css揭秘》读书笔记系列---实现垂直居中
date: 2016-07-04 16:17:09
layout: post
comments: true
tags:
    - css
    - summary
---

## 《css揭秘》读书笔记系列---实现垂直居中

这次的主题是实现用css实现垂直居中的几种方法

### 这篇文章不出意外的话，都是用的以下的html结构

```html
<div class="parent">
    <div class="children">
        some....
    </div>        
</div>
```

<!--more-->

### 传统方法

事实上，如果我们的元素、具有固定的宽度，高度。有一个相对比较麻烦的方法实现垂直居中

```css
.parent{
    position:absolute;
    top:50%;
    left:50%;
    width:20em;
    height:6em;
    margin-top:-3em;
    margin-left:-10em;
}
```
在这段代码中，将父元素进行绝对定位。相对于视口左上角的那种，(因为在这里并没有跟顶级的元素有positioned定位，所以这个父元素相对于body定位。然后在利用负外边距，向左向上移动距离是自身宽高的一半，让这父子俩位于视口的中心。

当然我们可以利用calc()函数，减少代码行数

```css
.parent{
    position:absolute;
    top:calc(50%-3em);
    left:calc(50%-10em);
    width:20em;
    height:6em;
}
```
当然如果你使用scss这类的预处理器的时候还可以写一个mixin ex:

```scss
@mixin center($w,$h){
    position:absolute;
    width:$w;
    height:$h;
    top:calc(50%-(#{$h}/2));
    left:calc(50%-(#{$w}/2));
}

```
可是这种方法之所以说是传统，就是因为他必须有规定的宽度，高度。我们在实际开发中不可能每次都写死了宽度高度。元素的尺寸往往是有内容决定的，在css中并没有某一个属性已元素自身的宽高为解析标准。

也许我们可以用translate()变形函数使用百分比来实现垂直居中。ex:

```css
.parent{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
}    
```
不过这个方法也有些缺点,作者这样说到:

> 有时候并不能使用绝对布局，他对于整个布局的影响太过强烈
  如果需要垂直的元素，高度超过视口的高度，那么他的顶部会被视口裁剪掉。

给个链接，看一[下](http://dabblet.com/gist/cd12fac0e18bb27fb62d)  

如果我们不使用定位，通常都会这样写

```css
.parent{
    width:20em;
    margin:50% auto 0;
    transform:translateY(-50%);
}
```
好像没什么问题，不过你看下这个jsbin的演示，你就知道。

<iframe class="" id="" data-url="http://jsbin.com/zuzive/1/edit?html,css,output" src="http://jsbin.com/zuzive/1/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

红红的框偏得很离谱，原因就是margin的百分比值是根据父元素的宽度为解析基准的。没有错，所有的margin-* 都是如此

不过没有关系，我们只要将百分比换成一个新的单位，视口相关的长度单位vh

1vh表示视口宽度的1%

```css
.parent{
    width:20em;
    margin:50vh auto 0;
    transform:translateY(-50%);
}
```

在看看效果

<iframe class="" id="" data-url="http://jsbin.com/zuzive/3/edit?html,css,output" src="http://jsbin.com/zuzive/3/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

显而易见，对比一下位置就知道了

## 利用flexbox实现垂直居中

当然这是最好的方法了，简单又快捷。

给我们需要垂直居中的父元素，这里是body元素加上display:flex,再给元素自身加上margin:auto就可以啦

```css
body{
    display:flex;
    min-height: 100vh;
    margin:0;
}

.parent{
    margin:auto;
}
```
这样写不仅仅是垂直居中，水平方向上也居中了。

当然也可以

```css
.parent{
    disply:flex;
    align-items: center;
    justify-content: center;
    width:20em;
    height:6em;
}
```
实现内部文本居中

我专门去查了浏览器对于flexbox布局的支持程度。[戳](http://caniuse.com/#feat=flexbox) 已经相当完善了

### 水平居中

说下水平居中

```css
.parent{
    text-align: center;
}
.children{
    display: inline-block;
}
```
这样写简单，兼容性也非常好

```css
.child{
    display:table;
    margin: 0 auto;
}
```

设置特别简单，只需对子元素进行设置.
