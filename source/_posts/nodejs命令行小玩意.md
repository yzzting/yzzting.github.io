title: nodejs命令行小玩意
layout: post
comments: true
date: 2016-02-14 00:02:08
tags:
	- nodejs
	- prompt
---

## 一个用nodejs写的一个命令行的小玩意

大家新年好，这里给大家拜个晚年啦！（不跑题了


偶然的npm社区看到这个prompt的库，对于node.js的一个美丽的命令行提示符。地址在这里[prompt](https://github.com/flatiron/prompt)稍微看了下（其实是懒 ，写了个小小的答题的命令行版。 当然了老规矩，登陆功能还是有的，crud不能忘了！

我简单的说下这个库的使用

<!--more-->


### 首先 0x00,启动这个库

```js
    var prompt = require('prompt');
    prompt.start();
```
### 0x01,程序的主入口

用主入口函数来做栗子

```js
	 function main() {
      console.log("输入你的想要的模式:1.答题模式 2.编辑模式");
      prompt.get(['number'], function(err, value) {
          var num = value.number;
          if (num === '1') {
              data.forEach(function(item, index) {
                  console.log(index + 1, item[0]);
              });
              aw();
          } else if (num === '2') {
              aks();
          }
      })
  }
```
这里的

```js
prompt.get(['number'],function(err,value)){}
```
number 就是一前缀名，或者说记录了用户的输入值，然后用value.number来获取到一个字符串，ok！用户输入的获取到了，剩下的就是一些程序的逻辑控制而已

### 0x02 当然不会这么快就结束！

我们来看下**login()**这个函数
```js
  function login() {
      prompt.get([{
          name: 'username',
          required: true
      }, {
          name: 'password',
          hidden: true,
          conform: function(value) {
              return true;
          }
      }], function(err, value) {

          var username = value.username;
          var password = value.password;

          if (username === 'yzz' && password === '5982') {
              console.log('login success'.blue);
              message();
          } else {
              console.log('login error!'.red);
              login()
          }

      });
  }
```

这个**prompt.get([])**里面多了一些东西，加了一些限制。根据字面意思，用户名必填，密码隐藏之类的。当然了，你也可以写点正则表达式什么的，反正我不会.更多的用法请参考作者的文档还有demo。

### 0x03 end

还有一个东西

```js
  prompt.message = '';
  prompt.delimter = '';

```
这两句把显示number的时候前面的prompt给去掉了，当然你想换掉的话在空字符串里写就ok。

代码写的好丑，逻辑也好low。大家看看开心就好，给个[地址](https://github.com/yzzting/nodejs-prompt)，如果有好想法就帮我pr一下

## 晚安
