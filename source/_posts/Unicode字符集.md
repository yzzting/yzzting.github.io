---
title: “💩”.length === 2
date: 2017-03-11 14:27:21
layout: post
comments: true
tags:
    - javascript
    - Unicode
---

## “💩”.length === 2

[原文地址](http://blog.jonnew.com/posts/poo-dot-length-equals-two)

一篇有趣的文章,关于Unicode字符集

对的,在javaScript中 “💩”.length === 2.你可以在Chrome调试控制台中或者Node.JS REPL中自己试试看.但是又为什么’⛳’.length === 1?

这一切都归结于码点还有Unicode字符集.如果你对Unicode字符集有点陌生,可以先戳这里 (又是英文的不看 ^-^)

<!-- more -->

接下来几个段落是[javaScript Unicode](https://mathiasbynens.be/notes/javascript-unicode)这篇文章的摘要,虽然是5年前的文章.

Unicode是目前绝大多数程序使用的字符编码,定义也很简单,用一个码点(code point)映射一个字符.码点值的范围是从U+0000到U+10FFFF,可以表示超过110万个符号.Unicode最前面的65536个字符位,称为基本平面（BMP-—Basic Multilingual Plane）,它的码点范围是从U+0000到U+FFFF.最常见的字符都放在这个平面,这是Unicode最先定义和公布的一个平面.

剩下的字符都放在补充平面（Supplementary Plane）,码点范围从U+010000一直到U+10FFFF,共16个.

我们可以用两种不同的方式表示字符, “A” === “\u0041” === “\x41” === “\u{41}” .这些是转义序列. \x可以用于大多数（但不是全部）基本多语言平面,具体为U+0000 〜 U+00FF. \u可用于任何Unicode字符,如果有多于4个十六进制数字,则需要花括号,否则为可选.当然这只是javaScript/HTML的规则,其他语言有自己的规则.

可以在[codepoints.net](https://codepoints.net/U+1F4A9)查到💩的码点 “💩” === “\u{1F4A9}”不幸的是,”💩” === “\uD83D\uDCA9”.所有码点都可以用代理对来表示,这是为了向后兼容.这就是为什么有一个公式来计算码点对应的代理对,反之亦然.

给定大于0xFFFF的码点C,它对应于代理对.

```js
H = Math.floor((C - 0x10000) / 0x400) + 0xD800
L = (C - 0x10000) % 0x400 + 0xDC00
```
因此,我们可以得到:

```js
C = 0x1F4A9
H = (Math.floor((0x1F4A9 - 0x10000) / 0x400) + 0xD800).toSring(16) = 0xD83D
L = ((0x1F4A9 - 0x10000) % 0x400 + 0xDC00).toString(16)
```

toString(16)将字符转为16进制,最终得到的答案对应于上面的\uD83D\uDCA9

我注意到表情符号被计为多个.事实上,如果您在密码字段中粘贴💩,您会看到:

另外这里有一篇讨论表情符号密码好处的[文章](https://medium.com/@hvost/why-you-should-not-use-emojis-in-your-passwords-b8db0607e169#.ee3f1qr43)

那么到底有没有一种方法可以正确的计数呢?[Bynens](https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols)列出了几种方法,ES6中的Array.from也有几种方式支持对代理对的解析,不过请不要在IE11以下尝试!!

```js
Array.from("💩").length === 1; //hooray!
```

however

```js
Array.from("❤️").length === 2; //boooo!
```

![](http://blog.jonnew.com/assets/poo-unicode/why1.jpg)

从我的理解❤️包括两个码点:U+2764和U+FE0F.首先是黑桃 然后是Variation Selector 16改变前一个字符的外观,事实上,U+FE00到U+FE0F都可以改变前一个字符的外观.对于这个心的情况,只有U+ FE0F.其他心（💙,💚,💛,💜）每个都有自己的码点,但红色的心需要两个.我不知道为什么,所以我问Stack Overflow.

为了适应这个,我必需改变我的代码:

```js
function fancyCount(str){
  return Array.from(str.split(/[\ufe00-\ufe0f]/).join("")).length;
}
```
使用正则表达式In .split(/[\ufe00-\ufe0f]/).join("")排除了变化选择器(variation selectors 这样翻?

```js
fancyCount("💩") === 1 //hooray!
fancyCount("❤️") === 1 //hooray!
```

因此我们成功了么?不,这篇文章我写得越多,漏洞就越多.我把把女人,心,吻,妇女emojis放在一起经常作为一个单一的表情符号.

```js
"👩‍❤️‍💋‍👩".length === 11
Array.from("👩‍❤️‍💋‍👩").length === 8
fancyCount("👩‍❤️‍💋‍👩") === 7
```

![](http://blog.jonnew.com/assets/poo-unicode/makeitstop.gif)

👩❤️💋👩是通过在组件emojis之间有一个零宽度Joiner \u{200D} 字符创建的.所以我们可以这样做:

```js
function fancyCount2(str){
  const joiner = "\u{200D}";
  const split = str.split(joiner);
  let count = 0;
  for(const s of split){
    //removing the variation selectors
    const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join("")).length;
    count += num;
  }
  //assuming the joiners are used appropriately
  return count / split.length;
}
```
so

```js
fancyCount2("💩") === 1 //hooray!
fancyCount2("❤️") === 1 //hooray!
fancyCount2("👩‍❤️‍💋‍👩") === 1 //hooray!
```
老实说,你最好永远都不要这样使用,并不是所有的浏览器,UI等,将👩❤️💋👩渲染为一个单一的符号.如果你有更好的计数方法请告诉我!

翻译的时候有所删减

文章整体思路

* 先找出emojis的码点
* 通过公式计算代理对
* 利用正则排除变化选择器,算出字节长度

参考资料

[Unicode与JavaScript详解](http://www.ruanyifeng.com/blog/2014/12/unicode.html)

[JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode)