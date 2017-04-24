title: Meteor+angularjs 实现轻论坛系列一
layout: post
comments: true
date: 2015-12-10 12:00
tags:
    - web
    - nodejs
    - AngularJS
---
Meteor的官网( Meteor )这样介绍这个框架：

>Meteor is an open-source platform for building top-quality web apps in a fraction of the time, whether you're an expert developer or just getting started.

按我自己的理解来说，Meteor是互联网江湖里面的**倚天剑**，**屠龙刀**。不同的是，不是**孤品**，人人可以有，就连我这个js菜鸟的可以比划几下

首先讲一下我的开发环境（ubuntu15.10 + sublime text 3）

# **环境搭建**

<!-- more -->

ubuntu环境下安装meteor特别容易

`    $ curl https://install.meteor.com/ | sh `

`    $ meteor --version                      `

敲入上面的命令后，出现版本号说明  安装成功！

    `$ meteor create Demo`

这里，我们创建了meteor的一个实例

    `$ cd Demo`

    `$ meteor`

我们通过 $ meteor 在项目的根目录启动这个 Demo 的实例 ，停止这个服务 Ctrl + c

![](http://7xp1k3.com1.z0.glb.clouddn.com/QQ截图20151208212013.png)

在这个项目中，meteor默认启动了Mongodb数据库。然后打开 http://localhost:3000

![](http://7xp1k3.com1.z0.glb.clouddn.com/20151209215348.png)

我们可以看到一个Meteor的默认初始页面，可以显示鼠标点击按钮的次数。
回到项目目录中，查看Demo文件夹，里面只有三个文件，分别是Demo.html,Demo.css,Demo.js Meteor中的javaScript代码可以在服务端和客户端同时运行！所以只有一个javaScript文件。

![](http://7xp1k3.com1.z0.glb.clouddn.com/20151209221415.png)

Meteor创建简单的app直接在项目根目录下创建js文件、HTML文件和CSS文件即可。运行项目的时候，所有的CSS文件，都会自动引入到HTML文件，而所有的HTML文件，都会拼成一个HTML文件。下面，我们去掉官方默认的模板，添加**Angular**进来

# **添加angularjs到Meteor项目中**

首先删掉初始化项目生成的三个文件

*    $ rm Demo.html Demo.css Demo.js  

然后我们新建一个 index.html 的文件,并敲入下面的代码，就是下面的代码，其他都不要！

``` html    
    <body>
	     <p>Yzz!!</p>
    </body>

```
这里，只写了 `<body></body>`这个标签，因为Meteor会扫描所有HTML文件，然后通过一系列的
整合，组成一个新的文件，自动补全其他标签

meteor吧！

*    $meteor  

start 项目后，去http://localhost:3000，

会看到页面上显示Yzz!!字样。

ok 下一步，我们添加Angular包(**在项目的根目录下add，以后无论是add什么包，都是这样！)

*    $meteor add angular  

添加完成后，以后run这个项目，前端会自动引用这个Angular，不必我们手动引入

touch一个新文件

*    $touch index.ng.html

这里，我们用了.ng.html 的后缀，为了不让Meteor的默认模板（Blaze）就不会编译到这个文件，Angular就可以使用这个文件了，然后敲入代码

```     html
    <p>Yzz Angular!</p>
```
修改 index.html 的代码

```html
    <body>
        <div ng-include="'index.ng.html'">
        </div>
    </body>
```
 这里使用了Angular的一个指令，ng-include用于引入外部HTML文件，注意这里的双引号里面还有单引号。然后在创建一个app.js文件，并输入如下代码
 ```javascript
    if (Meteor.isClient) {
    // 创建 Angular module
    // 并添加 angular-meteor 包依赖
    angular.module('Yzz', ['angular-meteor']);
    }
```
添加ng-app到index.html中
```html
    <body ng-app="Yzz">
         <div ng-include="index.ng.html"></div>   
    </body>
```
**Meteor**

![](http://7xp1k3.com1.z0.glb.clouddn.com/1449322982021.png)

额。。报错了，代码并没写错。。为什么？？
   别急。

** Meteor 1.2.1 ** 在angular模板这一块更新了二个组件 查看[官方文档](http://www.angular-meteor.com/tutorials/socially/angular1/bootstrapping) 在add Angular 1 这一块刚好写到

> It's time to add Angular 1 to our stack!

>Because we decided to work with AngularJS in the client side, we need to remove the default UI package of Meteor, called Blaze.

>We also need to remove Meteor's default ECMAScript2015 package named ecmascript because Angular-Meteor uses a package named angular-babel in order to get both ECMAScript2015 and AngularJS DI annotations.

>So let's remove it by running:

>    $ meteor remove blaze-html-templates

>    $ meteor remove ecmascript

>Now let's add the Angular 1 package to Meteor, back in the command line, launch this command:

>    $ meteor add angular

>This package takes care of connecting Angular 1 to Meteor and includes the latest Angular 1 library code into our app.

>That's it! Now we can use Angular 1's power in our Meteor app.

ok,因为html，有两个插件都在处理html文件， 所以产生了冲突，angular-templates, templating，删掉blaze-html-templates，就保留了angular-templates

另外js meteor 1.2.0.x 官方推荐用的是ecmascript，他是es6的转码器，不过angular-meteor自带的是angular-babel，用了angular-meteor还是照着它的文档来吧！

ok 现在meteor它，没问题！

**官方文档**说meteor是根据文件夹来区别是服务端还是客户端，所以我们将项目目录整理一下

* server：此文件夹下的代码只会在服务器端运行

* client：此文件夹下的代码只会在客户端运行

* public：这个文件夹下面的所有文件都可以直接公开访问

我们先创建三个文件夹，即client、server和model。client中放只需要客户端运行的代码，server放只需要服务端运行的代码，model放定义数据库collection的代码，客户端和服务端都需要运行

然后把index.html、index.ng.html和app.js文件移动到client文件夹下面，并修改app.js代码为

*   angular.module('Yzz', ['angular-meteor']);

因为app.js 现在在client文件夹下面并在客户端运行，所以我们不用 **Meteor.isClient **

index.html文件中ng-include引入的文件路径必须完整，修改index.html代码如下所示
```html
    <body>
        <div ng-include="'client/index.ng.html'"></div>
    </body>
```
ok,运行它 meteor

嗯，效果一样！，但是项目结构我们清晰了！

至此，我们成功的搭建了Meteor，并整合了angularjs，下一次将完成论坛用户模块！
