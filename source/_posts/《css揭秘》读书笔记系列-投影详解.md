---
title: 《css揭秘》读书笔记系列---投影详解
date: 2016-09-25 22:57:21
layout: post
comments: true
tags:
    - css
    - summary
---

## 《css揭秘》读书笔记系列---投影详解

好久没更,这次聊聊box-shadow这个属性

## 单侧投影

先了解下CSS3的box-shadow属性,比较常用的方法是指定三个长度和一个颜色值

ex:
```css
      .demo {
        box-shadow: 2px 3px 4px rgba(0,0,0,0.15)
      }
```

<!--more-->

效果如下:

<iframe style="width: 100%; height: 150px" src="http://sandbox.runjs.cn/show/hc6xh9di" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### box-shadow绘制原理

我用CSS实现了书里以图形化的方式讲解投影是如何绘制 ex:

<iframe style="width: 100%; height: 150px" src="http://sandbox.runjs.cn/show/l26lckcl" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

1): 第一步绘制一个和该元素相同尺寸位置，颜色为#000的矩形
2): 将它向右向下偏移10px
3): 使用[高斯模糊算法](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A)或是类似的算法(我不会这个..)将它进行4px的模糊处理。
4): 最后,将模糊后的矩形和原始元素交集的地方切掉,剩下偏移的部分。

使用4px的模糊半径意味着投影的尺寸会比元素本身的尺寸大差不多8px(左右和上下),因此投影的最外圈会从元素的四周向外显露出来，我们通过偏移量的控制投影的位置,只要不小于4px就ok了,但是我们要实现的是单侧投影！

#### 扩张半径

事实上box-shadow还有第四个长度参数,叫扩张半径。这个参数可以根据你指定的值去扩大或者缩小投影的尺寸,ex:一个-4px的扩张半径会把投影的宽度和高度各减少8px(左右和上下)

从套路上来说,如果扩张半径刚好等于模糊半径,对的,那么我们将看不到任何的偏移量。因此,我们只要给一个正的垂直偏移量,我们就会在底部看到一道投影,而另外三边是没有的。这正是我们要的效果

```css
.demo{
  box-shadow: 0 10px 4px -4px #000;
}
```

<iframe style="width: 100%; height: 150px" src="http://sandbox.runjs.cn/show/iizyebjv" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 邻边投影

跟单边投影一样的道理,邻边投影只要设置2个偏移量,并且值要大于或等于模糊半径的一半,因为我们想把投影藏进元素下面.
ex:

```css
.demo{
  box-shadow: 10px 10px 4px -2px #000;
}
```

<iframe style="width: 100%; height: 150px" src="http://sandbox.runjs.cn/show/9o5gpore" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

还有一点就是我们只是把一边都投影藏进一侧,剩下的一边露出。所以这里的扩张半径不应该是模糊半径的相反值,而应该是模糊半径的一半

## 双侧投影

假设我们有一个把投影设置在元素对边的需求(上下或左右)。这就有点麻烦了,扩张半径在每个方向上是均等的,也就是说我们没有办法让投影在水平方向放大,垂直方向缩小。目前的方法只有把单侧投影运用两次

```css
.demo {
  box-shadow: 10px 0 4px -4px #000,
              -10px 0 4px -4px #000
}
```

<iframe style="width: 100%; height: 150px" src="http://sandbox.runjs.cn/show/tcmnyaen" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## End
