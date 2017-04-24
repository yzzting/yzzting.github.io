---
title: 《css揭秘》读书笔记系列---实现条纹背景
date: 2016-07-02 16:23:47
layout: post
comments: true
tags:
    - css
    - summary
---

## 《css揭秘》读书笔记系列----实现条纹背景

最近在拜读《css揭秘》这本书，为了加深理解，我会写下一系列的读书笔记

### 直接进入正题

先说一个属性，**linear-gradient**------线性渐[变](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient)。通过这个属性，我们可以设置两个颜色值，让背景从颜色a过渡到颜色b，再设置起始位置，最后通过background--size来调整大小，就可以达到我们想要的效果

<!--more-->

### 实例

<iframe class="" id="" data-url="http://jsbin.com/rezolux/2/edit?html,css,output" src="http://jsbin.com/rezolux/2/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

通过上面的例子我们可以看到，设置linear-gradient便可以达到渐变，但是我们最终要的并不是这样。so，我们可以调整两个颜色渐变的位置看看效果。

<iframe class="" id="" data-url="http://jsbin.com/rezolux/4/edit?html,css,output" src="http://jsbin.com/rezolux/4/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

我们可以看到红色在容器高度40%以上的地方是纯色的，黄色在容器高度60%以下是纯色的。那么中间渐变的区域就讲道理的表小了。如果这个值是50%呢？

<iframe class="" id="" data-url="http://jsbin.com/rezolux/6/edit?html,css,output" src="http://jsbin.com/rezolux/6/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

oh，正如你所见，事实上这个body的背景已经没有任何的渐变效果了。是两条巨大的条纹。既然是背景，当然还可以通过调整background-size来控制大小

<iframe class="" id="" data-url="http://jsbin.com/rezolux/7/edit?html,css,output" src="http://jsbin.com/rezolux/7/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

在上面的例子中，我们将2条条纹都设置成了15px，再者背景在默认的情况下是重复平铺的。最终实现了我们想要的效果。

书里还说了一种三色条纹背景。

<iframe class="" id="" data-url="http://jsbin.com/rezolux/8/edit?html,css,output" src="http://jsbin.com/rezolux/8/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

道理就是通过调整不同颜色之前的渐变区域，将这个区域最小化，就可以达到效果

### 垂直条纹

既然，横的可以来，那么竖的条纹可以不可以实现呢？

事实上，linear-gradient这个属性，有一个默认的参数<angle> ，用角度值指定渐变的方向（或角度）。在横纹中，默认的角度是to bottom，也就是0°。所以他就是横的。综上，只要我们在横纹中，加上一定的角(90°，或者 to right ，就是竖纹啦。

<iframe class="" id="" data-url="http://jsbin.com/rezolux/9/edit?html,css,output" src="http://jsbin.com/rezolux/9/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>

当然你可以background-size的两个属性倒一下位置，就是重复平铺整个背景

### 题外话

这次用了jsbin作为文章的展示，不过jsbin并没有提供iframe的格式，我偷偷地把jsbin提供的src连接跳入iframe中，就可以用了。ex:

```html
<iframe class="" id="" data-url="http://jsbin.com/rezolux/9/edit?html,css,output" src="http://jsbin.com/rezolux/9/edit?html,css,output" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>
```
