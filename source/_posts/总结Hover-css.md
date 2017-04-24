layout: post
title: 总结Hover-css
date: 2016-06-08 17:23:18
tags:
    - css
    - summed
---

## 是时候沉淀一下自己

前段时间，发现了一个Hover的css库。抱着练练手的心态，clone下来慢慢学习，不知不觉也1个月多了。算是吧里面的所有效果都完成了，也用到了蛮多css3的特性，还有一些sass优秀的写法和整体文件结构。所以在这里总结一下这个库里get到的技能点。地[址](http://www.yzz1995.cn/Hover-css/#),文章较长，见谅。

<!-- more -->

### 整体的目录结构

```
├── effects
│   ├── 2d-transitions
│   ├── background-transitions
│   ├── border-transitions
│   ├── curls
│   ├── icons
│   ├── shadow-and-glow-transitions
│   └── speech-bubbles
├── _hacks.scss
├── hover.scss
├── main.scss
├── _mixins.scss
├── _option.scss
└── page

```

这是单纯的scss目录结构，在effects里面顾名思义写的是各种效果.scss，在page里面是网站基本样式。而hover.css是所有效果文件的import。比如

```scss
@import "effects/2d-transitions/grow";
@if $includeClasses {
    .#{$nameSpace}-grow{
        @include grow();
    }
}
```
(完整代码可[见](https://github.com/yzzting/Hover-css/blob/master/scss/hover.scss)

稍微解释下这段代码

```scss
@import "effects/2d-transitions/grow";
```
导入在这个目录下的_grow.scss文件

```scss
@if $includeClasses {
    .#{$nameSpace}-grow{
        @include grow();/*在hvr-grow里面导入grow*/
    }
}
```

这里其实我也没有很清楚明白原作者的意思，为什么要包多一层**@if $includeClasses {}** 却在 **_option.scss** 里面定义了 $includeClasses: true;，有点多余个人觉得，因为你要是将这个变量定义为false，那岂不是没有任何的include了。

### _option.scss

(完整代码可[见](https://github.com/yzzting/Hover-css/blob/master/scss/_option.scss)

主要是一些基础属性的配置，颜色宽度高度动画执行时间这类

### _mixins.scss

这个文件定义了一个prefixed的mixin，并传入两个参数

```scss
@mixin prefixed($property, $value) {
  @if $webkit == true {
    -webkit-#{$property}: #{$value};
  }

  @if $moz == true {
    -moz-#{$property}: #{$value};
  }

  @if $ms == true {
    -ms-#{$property}: #{$value};
  }

  @if $o == true {
    -o-#{$property}: #{$value};
  }

  #{$property}: #{$value};
}
```
通过判断事先在** _option.scss **定义好的各个浏览器的布尔值，是否补充不同浏览器对css3某些属性的差异性。举个例子

```scss
@include prefixed(transform,scale(1.15));
```
解析出来之后是
```scss
transform: scale(1.15);
```
定义动画的mixin keyframes 同理

```scss
@mixin keyframes($name) {
  @if $webkit == true {
    @-webkit-keyframes #{$name} {
      @content;
    }
  }

  @if $moz == true {
    @-moz-keyframes #{$name} {
      @content;
    }
  }

  @if $ms == true {
    @-ms-keyframes #{$name} {
      @content;
    }
  }

  @if $o == true {
    @-o-keyframes #{$name} {
      @content;
    }
  }

  @keyframes #{$name} {
    @content;
  }
}
```
这里记录一下@content的用法。@content在sass3.2.0中引入，可以用来解决css3的@media等带来的问题。它可以使@mixin接受一整块样式，接受的样式从@content开始。所以说@mixin通过@include调用后解析出来的样式是以拷贝形式存在的。当我们在某个效果的scss文件里面使用 @include 命令使用这条 mixin 的时候，将一段内容包裹了起来，这段被包裹的内容就会替换掉 @mixin 中的 @content。

比如说
```scss
@include keyframes(#{$nameSpace}-bob) {
    0% {
        @include prefixed(transform,translateY(-8px));
    }
    50% {
        @include prefixed(transform,translateY(-4px));
    }
    100% {
        @include prefixed(transform,translateY(-8px));
    }
}
```

解析出来后是
```scss
@keyframes hvr-bob {
  0% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px); }
  50% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px); }
  100% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px); }
}
```

### _hacks.scss

```scss
@mixin hardwareAccel() {
    @include prefixed(transform, translateZ(0));
    //欺骗浏览器开启GPU
}

@mixin improveAntiAlias() {
    box-shadow: 0 0 1px rgba(0,0,0,0);
}

@mixin fontSmooth {
    backface-visibility: hidden;
    //这句代码修复在 Chrome and Safari中，当我们使用CSS transforms 或者 animations时可能会有页面闪烁的效果
}

@mixin forceBlockLevel {
    display: inline-block;
    vertical-align: middle;//元素中线与父元素的小写x中线对齐。
}

@mixin hacks() {
    @include forceBlockLevel();
    @include hardwareAccel();
    @include fontSmooth();
    @include improveAntiAlias();
}
```
一个一个mixin慢慢来讲

首先是

```scss
@mixin hardwareAccel() {
    @include prefixed(transform, translateZ(0));
    //欺骗浏览器开启GPU
}
```
正如注释所写的通过他来欺骗浏览器开启gpu加速，效果仁者见仁智者见智。其实单纯一个hover的动画也没有很复杂。但是呢写都写了，聊胜于无吧。贴一段大牛的解释

>在Blink和WebKit内核的浏览器中，对于在CSS的transition或者animation中有opacity的改变的元素，将会为其创建一个图层。但也有很多开发者使用translateZ(0)或者translate3d(0,0,0)来人为地强制性地创建一个图层。 强制创建一个图层可以确保图层被绘制完毕并且可以在动画开始的时候，马上进入就绪状态。（创建并且绘制一个图层是一个不会有人反对的操作，并且它会延迟你的动画的开始），而且由于反锯齿的改变，动画中将不会出现唐突的变化。然而，需要有节制地增加图层；如果过分的增加图层，那么将会导致闪烁。

```scss
@mixin improveAntiAlias() {
    box-shadow: 0 0 1px rgba(0,0,0,0);
}
```
单纯加一个box-shadox属性

```scss
@mixin fontSmooth {
    backface-visibility: hidden;
    //这句代码修复在 Chrome and Safari中，当我们使用CSS transforms 或者 animations时可能会有页面闪烁的效果
}
```
在旋转的时候，将元素的背面隐藏。只展示元素面向屏幕的一面。比较冷门的属性

```scss
@mixin forceBlockLevel {
    display: inline-block;
    vertical-align: middle;//元素中线与父元素的小写x中线对齐。
}
```
说下vertical-align这个属性，middle把此元素放置在父元素的中部。也就是将每个按钮定位于父容器的中部。也是比较冷门的属性

## transition与animation

这个hover库，在动画方面主要用了这两个属性，记录一些痛点

### transition

**transition-duration** 这个属性定义动画的执行时间（以秒或毫秒计），他的好基友
**transition-property** 这个属性规定应用过渡效果的 CSS 属性的名称，比如说我们需要让元素放大1.1倍，这样写
```scss
transition-duration: 0.3s;
transform: scale(1.1);
transition-property: transform;
```
这样元素放大1.1倍这个过程就会被平滑的过渡，并以0.3s的时间执行

在bounce-in这个效果里，经过了放大一点，在放大一点的过程，地[址](http://www.yzz1995.cn/Hover-css/#)。一开始我想通过定义一个keyframes，但是后来发现了一个属性 **transition-timing-function** 规定过渡效果的速度曲线。说白了就是可以定义一个加速度来控制元素的运动过程，可是宝宝物理学不好，可是又被我发现了这个网[站](http://cubic-bezier.com/#.17,.67,.83,.67) 可以在线的设定你喜欢的运动加速度

```scss
transform: scale(1.15);
transition-timing-function: cubic-bezier(0.47, 2.02, 0.31, -0.36);
```
所以这样写可以不用定义keyframes，实现缓慢放大的效果啦

其他transition属性倒是比较常见，也好理解

### animation

这个get的技能点就比较多了，慢慢一个一个说

在这个hover库中，animation和keyframes搭配一起用。举个例子说
```scss
@keyframes hvr-buzz {
  50% {
    -webkit-transform: translateX(2px) rotate(2deg);
    transform: translateX(2px) rotate(2deg); }
  100% {
    -webkit-transform: translateX(2px) rotate(-2deg);
    transform: translateX(2px) rotate(-2deg); } }

.hvr-buzz {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    backface-visibility: hidden;
    box-shadow: 0 0 1px transparent;
}
.hvr-buzz:active, .hvr-buzz:focus, .hvr-buzz:hover {
    -webkit-animation-name: hvr-buzz;
    animation-name: hvr-buzz;
    -webkit-animation-duration: 0.1s;
    animation-duration: 0.1s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
}
```
**animation-name** 顾名思义指明要用哪个keyframes
**animation-duration** 和 **transition-duration** 用法一样
**animation-timing-function** 规定动画的速度曲线，或者这么说定义CSS动画在每一动画周期中执行的节奏 而这里的linear是线性的渐变
**animation-iteration-count** 定义动画在结束前运行的次数 可以是1次 无限循环. 默认是运行1次.这里的infinite是无限循环的意思
```scss
animation-fill-mode: forwards;
```
这个定义了让目标保持动画最后一帧的样式，当然最后一帧是取决与animation-direction和 animation-iteration-count:

```scss
animation-delay: 0.5s;
```
从动画样式应用到元素上到元素开始执行动画的时间差。该值可用单位为秒(m)和毫秒(ms)。如果未设置单位，定义无效，并没有默认值。通俗点讲就是，鼠标放上去0.5s后才有效果

## 小结

其实最近蛮烦的，看了好多东西又没有学得很深入。不知不觉大二就剩1个多星期了。一年后也不知道自己能以一种什么样的姿态走上工作的岗位，加油吧！
