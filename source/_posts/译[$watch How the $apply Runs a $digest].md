title: 译[$watch How the $apply Runs a $digest]
date: 2016-04-14 23:16:49
tags:
    - AngularJS
    - translation
---

>翻译着 [$watch How the $apply Runs a $digest](http://angular-tips.com/blog/2013/08/watch-how-the-apply-runs-a-digest/)

**更新**:这篇文章是给初学者而写的，适合对于像译者一样刚刚开始学习Angular，想知道如何实现数据绑定的同学。如果你已经可以熟练的掌握Angular，我强烈的建议你，通过源码进行分析。

<!--more-->

Angular的使用者想知道如何进行数据绑定，有很多解决这个问题的方法:`$watch`,`$apply`,`$digest`,`drity-checking`...这些究竟是什么，它们又是如何工作的呢？这里我将解决所有的问题。其实在官方的文档中有了详细的说明，但是我还是想将他们结合在一起讲。但是我只是用了一种简单的方法来讲解，如果想要了解技术细节，请查看源码。

让我们从头开始

## 浏览器事件和Angular.js扩展

我们的浏览器一直在等待事件。比如说用户交互。如果你点击了一个按钮或者输入了一段文字。事件回调就会在javascript的编译器中执行，然后你就可以进行DOM操作。因此，当回调事件完成时，浏览器将会在DOM上做出相应的改变。

Angular扩展在浏览器的循环上，创造了一个`angular context(angular上下文)`(记住它，它是一个重要的概念).要解释为什么是`context`以及它是如何工作的。我们需要解释更多的东西.

## $wathc 队列

每次你绑定一个UI时，就会将一个`$watch`添加到`$watch 队列`中。这里的`$watch`就是那个监视model有没有变化的东西。举个例子:

```html
User: <input type="text" ng-model="user" />
Password: <input type="password" ng-model="pass" />
```
在这里，我们的`$scope.user`绑定在第一个输入框，`$scope.pass`绑定在第二个输入框。所以我们有两个`$watch`插入到`$watch 队列`中

```js
app.controller('MainCtrl', function($scope) {
  $scope.foo = "Foo";
  $scope.world = "World";
});
```
```html
Hello,{{world}}
```

在上面的例子中，尽管在`$scope`中挂载着2个东西，但是实际绑定在UI视图中，只有一个。所以只有一个`$watch`插入到`$watch 队列`中

```js
app.controller('MainCtrl', function($scope) {
  $scope.people = [...];
});
```
```html
<ul>
  <li ng-repeat="person in people">
      {{person.name}} - {{person.age}}
  </li>
</ul>
```

有多少个`$watch`在上面的例子中被创造呢？每个person有一个(包括名字和年龄)再加上`ng-repeat`。如果有10个people，那么将会有`(2*10) + 1`,也就是21个

因此，每一个绑定在UI视图上的指令都会创造一个`$watch`。是的没错，但是这些`$watch`是在什么时候创造的呢？

当我们的模板被加载时，也就是说在`linking`阶段(关于angular的启动流程，请期待译者的下一篇文章),angular的编译器会寻找每个directive，并且创造所需要的`$watch`。听起来不错，但是，然后呢？

## digest 循环

还记得我说过的 `event-loop` 事件循环吗？当浏览器收到一个事件，该事件可以被`angular context`处理时，`$digest`循环就会触发。这个循环是由2个更小的循环拼起来的。一个用来处理`$evalAsync`,另一个用来处理`$watch`队列,也就是本文的主题。

那么，这是一个什么样的过程呢？`$digest`将会遍历`$watch`，然后询问:

* 嘿，`$watch`,你的值是多少？
    * 9
* 好吧！有没有改变过它？
    * 没有的
* (什么也没有发生与这一个，因此它移动到下一个`$watch`)
* 你的值是多少？
* 报告，是`Foo`.
* 刚才有没有改变过？
* 有的,一开始是`Bar`.
(好的，我们有DOM需要更新了)
* 就这样循环下去，知道每一个`$watch`都被检查过

这就是`dirty-checking`。现在所有的`$watch`都被检查过了，那就要问:有没有`$watch`更新过？如果还有至少一个更新过，这个循环将会再一次触发。直到所有的`$watch`没有在更新。这样做可以保证所有的model不再有变化，但是如果循环超过10次。他将会无限循坏下去。

当这个`$digest 循环`完成时，DOM也会做出相应的改变

(简单的说，angular会给每一个`$scope`成员变量求出一个摘要值(能够唯一标识一个变量),并保存在一个变量中。当调用`$digest/$apply`方法时，会重新计算这个摘要值，要是数据变化了，他就会自动的更新界面------译者注)

举个例子：

```js
app.controller('MainCtrl', function() {
  $scope.name = "Foo";

  $scope.changeFoo = function() {
      $scope.name = "Bar";
  }
});
```

```html
{{ name }}
<button ng-click="changeFoo()">Change the name</button>
```

这里我们只有一个`$watch`，因为`ng-click`这个函数它是不会变的。

* 我们点击这个按钮
* 浏览器将会接受在angular上下文中的事件,(我会解释 为什么在文章的最后)
* 脏检查机制就会开始执行，检查每一个`$watch`的改变
* 因为监视`$scope.name`的`$watch`报告了变化，它就会再一次执行脏检查机制
* 新的脏检查机制没有检测到变化
* 浏览器更新与`$scope.name`相应的DOM

这是非常重要的(也是很多同学感到非常不爽的地方)，每一个在`angualr context`范围内的事件都会运行脏检查机制。也就是说，我们输入一个字母，脏检查机制都会检查整个页面所有的`$watch`

## 通过$apply来进入angular context

是谁决定了什么事件进入`angular context`而谁又不进入呢？是`$apply`

如果你调用`$apply`，当该事件被触发时，他会直接进入`angular context`.如果你不调用，该事件就会在外面运行。是的就是这么简单。你会问在上个例子中我并没有调用`$watch`呀。因为angular自动帮你调用了。当你点击带有`ng-click`的元素时，就是调用了封装了`$apply`的`ng-click`。当你在绑定了`ng-model="foo"的输入框里输入了字母f，那么就会调用`$apply("foo = 'f';").

## angular什么时候不会给我们自动加`$apply`呢？

这是很多刚接触angular同学的痛点。为什么我的jQuery没有更新我的绑定呢？因为jQuery没有调用`$apply`，事件就没有进入`angular context` 因为根据上面说的这时候`$digest`就不会执行

我们来一个有趣的例子

试想一下，我们有以下的directive和controller：

```js
app.directive('clickable', function() {

return {
  restrict: "E",
  scope: {
    foo: '=',
    bar: '='
  },
  template: '<ul style="background-color: lightblue"><li>{{foo}}</li><li>{{bar}}</li></ul>',
  link: function(scope, element, attrs) {
    element.bind('click', function() {
      scope.foo++;
      scope.bar++;
    });
  }
}

});

app.controller('MainCtrl', function($scope) {
  $scope.foo = 0;
  $scope.bar = 0;
});
```
这个控制器里面有foo和bar，他们绑定在一个list里面，每次点击这个元素的时候，foo和bar就会自增1

那么当我们点击这个元素的时候发生了什么呢？我们可以看到更新吗？答案是否定的。因为这个点击事件并没有绑定`$apply`所以这意味着我们将失去count的值？不，并不会

事实上，`$scope`正在发生改变，但是并没有强制进行`$digest`循环，监视foo和bar的`$watch`也没有执行。那么如果我们自己执行一次`$apply`，那么所以的`$watch`就会看到这些变化，然后更新相应的DOM。

## Try it

<iframe class="" id="" data-url="http://jsbin.com/opimat/2/embed?live" src="http://jsbin.com/opimat/2/embed?live" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 30px;"></iframe>


如果我们点击这个指令（蓝色的地方），我们看不到任何的变化。
但是，我们点击按钮时，可以看到左边的字符串变化了，还看到了，我们点击了多少次蓝色的指令。正如我刚才说的这个点击的指令并没有开启`$digest loop`(脏检查机制)，但是，当按钮被点击时，这个`ng-click`自动的加上了`$apply`还有开始了脏检查机制。于是乎所有的`$watch`都会被检查，包括了foo和bar的`$watch`

这样的效果肯定不是你想要的，你想要点击指令的时候，更新绑定
。那很容易，我们只要调用`$apply`想这样:

```js
element.bind('click', function() {
  scope.foo++;
  scope.bar++;

  scope.$apply();
});
```
`$apply`是我们的`$scope`(或者是directive里的`link`函数中的`scope`)的一个函数，因此他会强制调用`$digest loop`(脏检查机制)()

<iframe class="" id="" data-url="http://jsbin.com/opimat/3/embed?live" src="http://jsbin.com/opimat/3/embed?live" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 67px;"></iframe>

有效果了，但是有更好的方法调用`$apply`

```js
element.bind('click', function() {
  scope.$apply(function() {
      scope.foo++;
      scope.bar++;
  });
})
```
有什么不同呢？在第一个版本中，我们是在`angualr context`外面更新数据。但是angular永远都不知道。很显然，在这个小玩具的例子中并没有太大的差别。但假设我们有一个alert款来提示错误，用了第三方的组件来调用它。要是没有封装到`$apply`里面，angular就永远不知道错误，不会弹出alert

所以，如果你想用一个jQuery插件，请确保你调用`$apply`来运行`$digest loop`(脏检查机制)来更新相应的DOM。

## 使用$watch监控

你已经知道，每次需要更新时，我们设置的每一个绑定都有自己的`$watch`，但是我们如果想自己定义自己的watches呢？简单

举个例子

```js
app.controller('MainCtrl', function($scope) {
  $scope.name = "Angular";

  $scope.updated = -1;

  $scope.$watch('name', function() {
    $scope.updated++;
  });
});
```
```html
<body ng-controller="MainCtrl">
  <input ng-model="name" />
  Name updated: {{updated}} times.
</body>
```
这里我们创造了一个新的`$watch`，第一个参数可以是字符串或者是函数，也是一个字符串而已，就是我们要监控的名字。在这种情况下`$scope.name`(注意我们只是需要`name`)。当`$watch`发生变化时，于是就调用了第二个参数。(这段有点生涩，翻得不好)

## Try it

<iframe class="" id="" data-url="http://jsbin.com/ucaxan/1/embed?live" src="http://jsbin.com/ucaxan/1/embed?live" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 67px;"></iframe>

我将`$scope.updated`初始化为-1，因为正如我说的，要知道当controller执行到这个`$watch`时，他就会立刻执行一次，所以我们才设置uodated为-1.

例子2：
```js
app.controller('MainCtrl', function($scope) {
  $scope.name = "Angular";

  $scope.updated = 0;

  $scope.$watch('name', function(newValue, oldValue) {
    if (newValue === oldValue) { return; } // AKA first run
    $scope.updated++;
  });
});
```
```html
<body ng-controller="MainCtrl">
  <input ng-model="name" />
  Name updated: {{updated}} times.
</body>
```
第二个参数接受了2个参数。新的值和老的值。我们可以用它们来跳过`$watch`第一次运行(updated = 0)。通常你并不需要跳过第一次运行，但是在你需要它（像这样）的极少数情况下，这一招就派上用场了。

例子3：

```js
app.controller('MainCtrl', function($scope) {
  $scope.user = { name: "Fox" };

  $scope.updated = 0;

  $scope.$watch('user', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }
    $scope.updated++;
  });
})
```
```html
<body ng-controller="MainCtrl">
  <input ng-model="user.name" />
  Name updated: {{updated}} times.
</body>
```
我们想要监视`$scope.user`对象里的任何变化，和以前一样只是用一个对象来代替前面的字符串。

## Try it

<iframe class="" id="" data-url="http://jsbin.com/ucaxan/3/embed?live" src="http://jsbin.com/ucaxan/3/embed?live" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 67px;"></iframe>

没有用？他并没有工作？为什么？因为`$watch`只是默认的比较两个对象引用的是否相同。在例子1和2中，每次我们修改`$scope.name`的值，都会创建一个新的基本变量。也就是说监控的是新的`$scope.user`,但我们新的值是`$scope.user.name`所以并没有变化(还是翻不好，这里我用自己的理解写出来了)

这显然不是我们想要的

例子4：

```js
app.controller('MainCtrl', function($scope) {
  $scope.user = { name: "Fox" };

  $scope.updated = 0;

  $scope.$watch('user', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }
    $scope.updated++;
  }, true);
});
```
```html
<body ng-controller="MainCtrl">
  <input ng-model="user.name" />
  Name updated: {{updated}} times.
</body>
```
## Try it

<iframe class="" id="" data-url="http://jsbin.com/ucaxan/4/embed?live" src="http://jsbin.com/ucaxan/4/embed?live" style="border: 1px solid rgb(170, 170, 170); width: 100%; min-height: 300px; height: 67px;"></iframe>

现在有效果了，我们增加了第三个参数，这时的`$watch`是一个布尔值，表明是我们要比较的对象的值，而不是引用。所以当我们更新`$scope.user.name`时，`$scope.user`也会改变，能够正确触发。

关于`$watch`还有更多的tips&tricks，不过我说的这些只是基础。

## 总结

我希望你学会了angular的数据绑定。我想你的第一印象是，这个脏检查机制是缓慢的。这是不正确的，这是快如闪电的。如果你的项目中有2000-3000个`$watch`，他才会开始变得缓慢，但是你如果你需要这个数量级，就可以找个用户体验专家聊聊。

无论如何，随着ECMAscript6的发布，在angular未来的版本中。我们将会有`OBject.observe`，可以极大的改善`$digest`循环的速度。同时未来的文章也会有一些tips&tricks。

在另一方面，写这篇文章是不容易的，如果你发现我错过了一些重要的事情或有什么完全错误的，请填提一个issue，在Github上或写pull请求:)

## 最后

虽然，文章有点老了。但是关于这个angular的数据绑定，还是解释得非常详细和得到。所以我选择将它翻译过来。这也是我第一篇译文，正如作者最后所说的，如果你发现我错过了一些重要的事情或有什么完全错误的，请联系我。直接在下面评论即可

## 参考资料

[AngularJS实例教程（一）——数据绑定与监控](https://github.com/xufei/blog/issues/14)

[Angular沉思录（一）数据绑定](https://github.com/xufei/blog/issues/10)
