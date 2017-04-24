---
layout: post
title: 《css揭秘》读书笔记系列-根据兄弟元素数量设置样式
date: 2016-10-23 22:16:58
comments: true
tags:
    - css
    - summary
---

## 《css揭秘》读书笔记系列-根据兄弟元素数量设置样式

这次主要讲CSS3的伪类选择器

### 老规矩,基本HTML结构

```html
<ul>
  <li></li><!--li数量不定-->
</ul>
```

<!--more-->

### 解决方案

ex:当只有一个列表项的时候,解决方案就是:only-child.这个伪类选择符就是为这样的情况设计的

```css
li:only-child {
  /* 只有一个列表项的样式*/
}
```
<iframe class="" id="" data-url="http://jsbin.com/jezeyozude/edit?html,css,outputt" src="http://jsbin.com/jezeyozude/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

当然 :only-child === :first-child:last-child,道理很简单如果第一项等于最后一项,那从某种意义上来讲他就是唯一的一项.

```css
li:first-child:nth-last-child(1) {
  /*相当于li:only-child*/
}
```
<iframe class="" id="" data-url="http://jsbin.com/coreba/edit?html,css,output" src="http://jsbin.com/coreba/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

跟着这个思路,如果把:nth-last-child(1)中的这个1换成4会是什么样?在一个有4个列表项的列表中**li:first-child:nth-last-child(4)** 刚好可以命中这个列表的第一个列表项,那么我们再结合兄弟选择符来命中他之后的所有兄弟元素,从而命中所以列表项

```css
li:first-child:nth-last-child(4),
li:first-child:nth-last-child(4) ~ li {
  /*当列表正好包含这4个项时,命中所有列表项*/
}
```
<iframe class="" id="" data-url="http://jsbin.com/coreba/7/edit?html,css,output" src="http://jsbin.com/coreba/7/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

当然我们可以用SCSS这样的预选择器来处理

```css
@mixin n-items($n) {
  &:first-child:nth-last-child(#{$n),
  &:first-child:nth-last-child(#{$n) ~ & {
    @content
  }
}
li {
  @include n-items(4) {
    /*属性什么的写这里*/
  }
}
```

(不知道为什么不高亮了....

### 根据兄弟元素的数量范围来匹配元素

在实际场景中,我们匹配元素的条件往往不是列表项的具体数量,而是一个数量范围.:nth-child() 选择符在这方面非常好用,我们完全可以用它来命中一个范围,ex:"选中第4项之后的内容".而他的参数还可以是表达式an+b ex:(:nth-child(2n+1)).如果是用n+b这种形式的无论n取什么值这个表达式都无法产生一个小于b的值(好像是废话。。。。)所以这种形式可以命中从第b个开始的所有子元素.ex: :nth-child(n+4) 会选择除了第一,二,三个子元素之外的所有子元素

<iframe class="" id="" data-url="http://jsbin.com/coreba/13/edit?html,css,output" src="http://jsbin.com/coreba/13/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

因此,利用这技巧,我们可以在列表的总数是4或者更多的时候命中所有列表项

```css
li:first-child:nth-last-child(n+4),
li:first-child:nth-last-child(n+4) ~ li {
  /*当列表正好至少包含4个项,命中所有列表项*/
}
```

<iframe class="" id="" data-url="http://jsbin.com/coreba/9/edit?html,css,output" src="http://jsbin.com/coreba/9/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

同理,-n+b这种形式可以命中开头的b个元素.因此当列表项有4个或者小于4时,要选中所有列表项可以这么写

```css
li:first-child:nth-last-child(-n+4),
li:first-child:nth-last-child(-n+4) ~ li {
  /*当列表正好最多包含4个项,命中所有列表项*/
}
```

<iframe class="" id="" data-url="http://jsbin.com/coreba/10/edit?html,css,output" src="http://jsbin.com/coreba/10/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

当然,我们想要命中2-6个列表项时呢?

```css
li:first-child:nth-last-child(n+2):nth-last-child(-n+6),
li:first-child:nth-last-child(n+2):nth-last-child(-n+6) ~ li {
  /*当列表正好包含2-6个项,命中所有列表项*/
}
```
<iframe class="" id="" data-url="http://jsbin.com/coreba/12/edit?html,css,output" src="http://jsbin.com/coreba/12/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

### 在线实验

[CSS3 structural pseudo-class selector tester](http://lea.verou.me/demos/nth.html)
