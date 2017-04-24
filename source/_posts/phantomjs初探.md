layout: post
title: phantomjs初探
date: 2016-06-06 22:51:44
tags:
      - javascript
      - phantomjs
---

## 前言

大家都这么说PhantomJs的

> Phantom JS是一个服务器端的JavaScript API的WebKit。其支持各种Web标准:DOM处理、CSS选择器、JSON、Canvas和SVG

### 安装

其实网上蛮多安装方法的，或者直接看看官网的[指南](http://phantomjs.org/download.html)
。我一开始没弄明白直接下载那个二进制包怎么用，自己跑去[编译](http://phantomjs.org/build.html)了。

<!--more -->

### 先试试看PhantomJs的厉害

我们通过几行代码把github的首页截下来

```js
var page = require('webpage').create();
//创建一个web page对象
page.open('http://github.com/', function() {
  page.render('github.png');
  phantom.exit();
});

```
将上面这段代码写进screen.js然后

在终端里执行 **phantomjs screen.js**

[篇幅的原因点这里看效果](http://7xp1k3.com1.z0.glb.clouddn.com/githubphone.png)

这里截取的是手机版的页面，我们可以加上一句
**page.viewportSize = { width: 1920, height: 1080 };**

设置width和height就可以截到pc版的页面

[篇幅的原因点这里看效果](http://7xp1k3.com1.z0.glb.clouddn.com/github.png)

### 页面自动化

页面自动化也是PhantomJs一大feature,这里我们用来模拟登陆,登陆京东试试看

```js
var page = require('webpage').create();

page.onLoadStarted =function() {
    loadInProgress =true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};
page.onUrlChanged = function() {
    console.log("onUrlChanged");
};
 page.open('https://passport.jd.com/new/login.aspx', function() {
    page.includeJs("http://libs.useso.com/js/jquery/2.1.1/jquery.min.js", function() {
        var rect = page.evaluate(function() {
            $('#loginname').val('ma sai ke');
            $('#nloginpwd').val('ma sai ke');
            $('#loginsubmit')[0].click();
            return document.title;
        });
        //若引入jQuery 则用这种方法来实现click
        page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
        console.log(rect);
        var clock =setTimeout(function(){
            page.render('jdlogin.png');
            phantom.exit();
        },2000);
    });
});
```
[篇幅的原因点这里看效果](http://7xp1k3.com1.z0.glb.clouddn.com/jdLogin.png)

在上面代码里填入用户名和密码就行了。这样就可以登陆，不过总觉得这种方式怪怪的。。不大安全的感觉

##参考资料

[PhantomJS 官方文档](http://phantomjs.org/documentation/)
[PhantomJS 官方 API](http://phantomjs.org/api/)
