layout: post
title: Angular.js实现即时搜索
date: 2015-12-18 00:27:08
comments: true
tags:
	- AngularJS
---

# Angular.js实现即时搜索

现在是2015.12.18凌晨24点31分，突然想起之前做过一个Angular写的即时搜索，就当是一个复习吧，在这篇博文里把实现过程记下来！
我还在学Angular1.x这个版本中，听说Angular2 beta版已经放出来了！啦啦啦啦啦，不过我对于es6，Typescript，还是傻乎乎的~~~
**MrSunny**在这篇文章里写到[Angular2 简介](http://zhuanlan.zhihu.com/FrontendMagazine/20058966)
> 我希望你学习 Angular 2 能比学图片中的单词还要快 :)

<!--more-->

希望真的如此吧！:)

好了，进入干货！

# 服务框架


为了让项目可以跟后台通信，这里我们采用Nodejs的Express框架来搭建。
老规矩

` $sudo npm install express `

在express4.0以上的版本，必须装多express的命令行工具，否则，express不了项目。

` $sudo npm install express-generator `

然后create一个项目- `$ express -e search `

我偷懒了，直接 `$ npm start`

嗯，项目启动了！

## bower

现在github上很多例程都使用[bower](http://bower.io/)来管理前端的通用依赖库，比如jquery, bootstarp, angularjs等等。一句命令，可以把我们需要的库，导入项目中，特别方便！

**这里要说一下通过bower下载库，说到底就是在git clone。所以对于linux系统没什么好说，先装个git，然后没问题了。对于window，装完git后，最好用git bash 来执行bower install，或者把git目录加入windows的环境变量中，再在命令行中执行bower install命令，不要问我为什么，window好多游戏好好玩！**

先cd到search/public 目录下，然后通过bower来安装Angular.js
`$bower install angualr --save `

--save 参数可以把bower依赖添加到bower.json

在views/index.ejs 文件里引入Angular.js（再说点别的，可以在项目根目录，建一个.bowerrc的文件，写入`{"directory":"public/components"} `
指定依赖库的安装路径）

```
<script src="public/components/angular/angular.min.js"></script>

```
## 组件列表

* 指令

* 控制器
**ng-controller: 定义应用程序的控制器；
ng-init: 初始化应用程序数据；
ng-click: 定义元素被点击的行为；
ng-show: 控制元素显示(true)、隐藏(false)；
ng-hide: 控制元素显示(false)、隐藏(true);**
* 过滤器

下面将会定义一个rule的自定义过滤器

* $http 通信

## 完整代码


* index.ejs

```
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/stylesheets/style.css">
    <script src="public/components/angular/angular.min.js"></script>
    <script src="public/javascripts/app.js"></script>
  </head>
  <body>
    <div ng-app="yzzApp" ng-controller="searchCtrl" class="container">
        <input type="text" ng-model="rule" ng-change="switch()">
        <div ng-show="show" class="list">
            <!-- 遍历数据集合，并通过过滤器筛选 -->
            <div ng-repeat="x in people | filter:rule" class="list-item">
                {{ x.name + '-' + x.age }}
            </div>
        </div>
    </div>
  </body>
</html>

```

* app.js

```js
	var app = angular.module('yzzApp', []);
        var peopleArr = [];
        // 在控制器中引入 http 服务
        app.controller('searchCtrl',['$scope', '$http', function($scope, $http) {
            $scope.show = false;
            $scope.rule = '';
            $scope.people = [];
            $scope.switch = function() {
               if($scope.rule.length > 0) {
                    $scope.show = true;
                    $scope.people = peopleArr;
               } else {
                    $scope.show = false;
                    $scope.people = [];
               }
            }

            // 使用 http 服务获取数据
            $http({
                method: 'GET',
                url: '/data/data.json'
            }).then(function successCallback(res) {
                res.data.people.forEach(function(i) {
                    peopleArr.push(i);
                })
            },function error(res) {
                console.log(res);
            })
        }])

```

## 为了模拟实际业务场景，我们在public/data文件里，new一个data.json 文件用于保存业务数据


``` json
{
    "people": [
        {
            "name":"james","age":12
        },
        {
            "name":"jack","age":22
        },
        {
            "name":"tony","age":21
        },
        {
           "name":"Yzz","age":31
	   },
        {
            "name":"alex","age":25
        }
    ]
}

```
* style.css

```css
.container {
    margin: 50px 0;
    text-align: center;
}
.container input {
    width: 200px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 5px 10px;
}
.list {
    width: 220px;
    text-align: left;
    border: 1px solid #ccc;
    margin: 0 auto;
}
.list .list-item {
    border-bottom: 1px solid #eee;
    padding: 5px 10px;
}
.list .list-item:hover {
    background-color: #eee;
}

```
## 一个最简陋的Angular.js即时搜索就完成了

28行代码搞定，也许这就是**angular**的魅力所在吧！

# 晚安
