---
title: 译[Things I’ve Learned About CSS Grid Layout]
date: 2016-12-07 00:39:10
layout: post
comments: true
tags:
    - css
    - translation
---

[原文地址](https://css-tricks.com/things-ive-learned-css-grid-layout/?utm_source=mybridge&utm_medium=email&utm_campaign=read_more)

以下是Oliver Williams写的文章.Oliver一直以来都在学习CSS网格布局,也学到了很多知识.在这篇文章里,他将会讨论他在这段旅途中学到的不同概念.通过每一个小例子学习到关于网格布局的知识.我喜欢这样的想法.这也使得学习网格布局这件事轻松很多

<!-- more -->

CSS网格可能在2017年初在浏览器上使用.在此之前你可能需要手动的开启这个功能才可以工作.(除非是在Firefox Nightly里默认就开启了它)Chrome Canary版本目前具有最佳实现.同时,Firefox有一个非常有价值的附加组件叫CSS网格检查器,它可以显示网格的线.它是目前唯一有这样一个工具的浏览器.

在Chrome中,在地址栏中输入“chrome:// flags”,找到“启用实验性网络平台功能”,然后点击启用.IE和Edge不兼容,因此不建议在此时间点对网格进行实验.

## 不能有俄罗斯方块一样的图形

#### 你很快就明白了

<img sizes="(max-width: 1080px) 100vw, 1080px" srcset="https://cdn.css-tricks.com/wp-content/uploads/2016/10/no-tetris.png 1080w, https://cdn.css-tricks.com/wp-content/uploads/2016/10/no-tetris-300x198.png 300w, https://cdn.css-tricks.com/wp-content/uploads/2016/10/no-tetris-768x506.png 768w, https://cdn.css-tricks.com/wp-content/uploads/2016/10/no-tetris-1024x675.png 1024w" src="https://cdn.css-tricks.com/wp-content/uploads/2016/10/no-tetris.png" alt="">

在网格区域中只能是矩形(如左),而不是任意多边形(如右)

## 网格系统是用来和flexbox一起使用,而不是代替它

网格的原理和flexbox类似,你可能看到人们使用flexbox来构建网格系统,但这不是flexbox的设计目的.这有一篇文章值得一看[Don't use flexbox for overall page layout](https://jakearchibald.com/2014/dont-use-flexbox-for-page-layout/)

简单来说:
    * Flexbox用于一维布局(行和列)
    * CSS网格是二维布局

Rachel Andrews [说](https://rachelandrew.co.uk/archives/2016/03/30/should-i-use-grid-or-flexbox/)

> Flexbox is essentially for laying out items in a single dimension – in a row OR a column. Grid is for layout of items in two dimensions – rows AND columns.

> Flexbox本质上是用于在单个维度中布置项目 - 在行和列中
网格用于在二维中的项目布局 - 行和列

它们也可以组合.你可以将网格项转换为flex容器.你可以将flex项目转换为网格.

让我们举一个有用的例子.我们想要在一个网格项内垂直居中文本，但我们想要背景（无论是颜色，渐变还是图像）覆盖项目整个网格区域。我们可以将align-items值设为center,但现在背景不会填充整个区域。align-items的默认值是stretch,只要将它设置为其他值,他就不在填充该空间.让我们将他设置为拉伸并将我的网格项转换为flex容器

```css
.grid {
    align-items: stretch;
}

.griditem {
    display: flex;
    align-items: center;
}

```

## 使用负值的行数可以有很大的帮助

设想一个具有12列网格的CSS网格框架.在小屏幕上,不是减少列数,而是将内容合并所有12列,给人一个全宽列的印象.

你可以这样写

```css
/* For small screens */
.span4, .span6, .spanAll {
  grid-column-end: span 12;
}

/* For large screens */
@media (min-width: 650px) {
  .span4 {
    grid-column-end: span 4;
  }
  .span6 {
    grid-column-end: span 6;
  }
}

```

这种方法没有错,然而使用CSS网格,重新定义列数也很容易.通过使用-1,你可以确保你的内容将横跨所有列.

```css
/* For small screens */
.span4, .span6, .spanAll {
  grid-column-end: -1;
}
```

## 待续
