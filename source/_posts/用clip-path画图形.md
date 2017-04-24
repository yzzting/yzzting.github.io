---
title: 用clip-path画图形
date: 2016-08-01 16:09:06
layout: post
comments: true
tags:
    - css
---

## 用clip-path画图形

css发展到现在,在图形绘制这块几乎是无所不能。但是一些稍微复杂的图形，都是利用border和多个HTML元素来构建，导致其可扩展性不高。所幸，css3还有clip-path这个属性，这个属性刚看有点陌生，毕竟是存在与SV[G](http://www.oxxostudio.tw/articles/201406/svg-09-clipping-masking.html)里头的
。利用遮罩的方法，连接座标绘制遮罩区域，就可以做出许多不同的形状，让底色或底图显现，随着浏览器对于CSS3的支援度大幅提升，自然而然的就可以用它来做些与众不同的变化。

<!-- more -->

## clip-path原理

首先，在chrome版本 51.0.2704.84 (64-bit) 上 clip-path属性仍然要加-webkit-的前缀。使用前需考虑兼容[性](http://caniuse.com/#search=clip-path).

还有要注意的是

> 使用clip-path 要从同一个方向绘制，如果顺时针绘制就一律顺时针，逆时针就一律逆时针，因为polygon 是一个连续的线段，若线段彼此有交集，面积区域就会有相减的状况发生( 当然如果这是你要的效果就无妨了)。如果绘制时采用「比例」的方式绘制，长宽就必须要先行设定，不然有可能绘制出来的长宽和我们想像的就会有落差，使用「像素」绘制就没有这种问题。

说了这么多，放几个图形讲一下

### 圆形

```css
.circle {
  width: 100px;
  height: 100px;
  background: #ee6e73;
  -webkit-clip-path: circle(50% at 50% 50%);
}
```
![](http://7xp1k3.com1.z0.glb.clouddn.com/20150330_1_04.png)

-webkit-clip-path: circle(50% at 50% 50%); 第一个50%是半径，后面两个50%是圆心的位置，看图就明白了

### 椭圆

```css
.oval {
  width: 200px;
  height: 100px;
  background: #ee6e73;
  -webkit-clip-path: ellipse(25% 40% at 50% 50%);
}
```
![](http://7xp1k3.com1.z0.glb.clouddn.com/20150330_1_05.png)

-webkit-clip-path: ellipse(25% 40% at 50% 50%); 和圆形类似，25%,40%分别表示短径和长径长，后面两个50%是圆心的位置

### 正方形

```css
.square {
  width: 100px;
  height: 100px;
  background: #ee6e73;
  -webkit-clip-path: polygon(0% 0%, 0 100%, 100% 100%, 100% 0%);
}
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/20150330_1_08.png)

### 五边形

```css
.pentagon {
  width:162px;
  height:154px;
  background:#ee6e73;
  -webkit-clip-path:polygon(0% 38.31%, 50% 0%,100% 38.31%,80.86% 100%,19.14% 100%);
}
```

![](http://7xp1k3.com1.z0.glb.clouddn.com/20150330_1_09.png)

五边形得稍微计算一下 59/(59+95)=38.31%，31/(81*2)=19.14%

其他图形也是同样的思路，先选择一个坐标原点(0,0) 然后根据图形的长宽去计算每一个点的位置，就像小学生做数学题那样。

## 总结

从上面的实例来看，利用clip-path来绘制图形非常的快捷，定义长宽，颜色，计算每个点的对应位置，就可以了。除了一些浏览器哩哩抠抠的兼容性问题之外，还是不错的

## 参考链接

[In Pieces - 30 Endangered Species, 30 Pieces.](http://species-in-pieces.com/)
[Graphic](http://zt.yzz1995.cn/)
