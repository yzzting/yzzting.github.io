---
title: 译[dependency injection in angular2]
date: 2016-11-25 22:22:49
layout: post
comments: true
tags:
    - AngularJS
    - AngularJS2
    - translation
---

[原文地址](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)

依赖注入一直是angularJS最大的特性,它允许我们在不同的组件之间依赖注入,而不用去关心如何去创建这些依赖关系,或者它们之间需要的依赖关系是什么.然而,事实证明在Angular1的依赖注入系统中存在一些问题,所以在下一代框架Angular2中解决了这些问题.在本文中我们将深入探讨新的依赖注入系统

在我们进入新系统之前,让我们先了解依赖注入是什么,以及在Angular1中DI的问题

<!-- more-->

## 依赖注入模式

[Vojta Jina](https://twitter.com/vojtajina)在[ng-conf 2014](https://www.youtube.com/watch?v=_OGGsf1ZXMs)上有一个关于依赖注入的演讲.在这个演讲中他介绍了将为Angular2开发新的DI系统的思路和想法.他也非常清楚,我们可以知道DI做了两件事:作为一种设计模式和一个框架.前者解释了什么是DI模式,后者可以帮助我们系统的组装和维护依赖关系.我想在这篇文章中做同样的事情,帮我们理解

我们首先来看看下面的代码并试着分析它引入的问题

```js
class Car {
    constructor() {
        this.engine = new Engine()
        this.tires = Tires.getInstance()
        this.doors = app.get('doors')
    }
}
```

显而易见,我们有一个Car类,他有一个构造函数,其中设置了汽车一切需要的属性.在代码里发现了什么问题吗?正如你所见,构造函数不仅将所需的依赖项分配给内部属性.也知道如何去创建所需的对象.例如engine属性是由Engine对象产生的,Tires似乎是一个单例对象.doors是从一个全局对象中获取的.全局对象类似于服务定位(service locator)

如果这样写将难以维护和测试代码.可以想象一下你想测试这个类.在这段代码中你如何用一个MockEngine依赖来替换Engine?在编写测试代码的时候,我们需要在不同的场景中测试我们的代码.因此每个场景都需要有自己的配置.我们想编写可测试的代码,则需要编写可重用的代码.只要所有依赖关系都满足,我们的代码应该在任何环境中工作.这使我们可以得出结论,可测试的代码===可重用的代码,反之亦然

那么我们如何更好的编写这个Car类呢?使它更易于测试呢?这非常容易,你可能已经知道怎么做了,我们将代码更改为:

```js
class Car {
    constructor(engine,tires,doors) {
        this.engine = engine
        this.tires = tires
        this.doors = doors
    }
}
```
我们所做的是,把构造函数中所依赖的对象移动到构造函数的参数中,这段代码就没有了具体的实现.我们将创建这些依赖的职责转移到更高的层次.如果我们想创建一个Car对象,我们只需要将所需要的对象传递给构造函数:

```js
var car = new Car (
    new Engine(),
    new Tires(),
    new Doors()
)
```
这蛮酷的,现在依赖关系在我们的类中解耦,在测试中可以通过Mock来编写测试代码

```js
var car = new Car(
    new MockEngine(),
    new MockTires(),
    new MockDoors()
)
```

猜猜看这是什么?这就是依赖注入.具体一点讲,这个特定的模式也可以称为构造函数注入.还有另外两种注入模式,setter注入和interface注入.但我们不会在这篇文章中讨论.

OK! 现在我们使用DI,但是什么时候DI会发挥作用?之前说过,我们将创建这些依赖的职责转移到更高的层次

```js
function main() {
    var engine = new Engine()
    var tires = new Tires()
    var doors = new Doors()
    var car = new Car(engine,tires,doors)

    car.drive()
}
```

我们需要写一个main函数,这样做并不是很好,当我们的应用程序越来越大,所以:

```js
function main() {
    var injector = new Injector(...)
    var car = injector.get(Car)

    car.drive()
}
```
## 依赖注入作为框架

这是依赖注入作为框架的地方.正如我们知道的,Angular1有自己的DI系统,允许我们注入服务和其他组件.让injector知道什么对象需要实例化,例如,以下代码显示了我们如何在Angular 1中注释我们的Car类：

```js
class Car {
    constructor() {

    }
}

Car.$inject = ['Engine','Tires','Doors']
```

然后我们为Car注册一个服务,每次我们请求它,我们得到一个单例对象,则不需要关心Car类所需要的依赖

```js
var app = angular.module('myapp',[])

app.service('Car',Car)

app.service('OtherService',function(Car){
    //instance of Car available
})

```

这很酷,但是还是有些问题:

* 内部缓存 - 依赖是单例的,当我们请求一个服务时们,它在每个应用的生命周期中只会创建一次,创建工厂模式来解决这个问题也是不可取的.
* 命名空间碰撞 - 在应用程序中只能有一个“type”的标记,会有一个问题,如果我们有car服务,然而第3方扩展也引入了一个相同名字的服务.
* 内置框架 - Angular 1 DI被嵌入在整个框架中,我们无法使用它作为一个独立的系统用来解耦.

这些问题需要得到解决,以便使Angular的DI达到下一个水平.

## Angular 2 依赖注入

在我们看实际代码之前,先来理解Angular 2中新的DI背后的概念.下图说明了新的DI系统的必需组件

![](http://blog.thoughtram.io/images/di-in-angular2-5.svg)

Angular 2 新的DI系统基本上由这三个东西组成

* Injector injector是我们创造依赖对象的API
* Provider provider像一个方法,告诉injector如何创建依赖实例,需要绑定一个token,并映射到工厂函数中,创建一个对象
* Dependency dependency是创建依赖对象的类型

好的,我们现在有一个概念,让我们把它翻译成代码.继续保持Car类和他的依赖.并用Angular 2的DI来实现

```js
import { ReflectiveInjector } from '@angular/core';

var injector = ReflectiveInjector.resolveAndCreate([
  Car,
  Engine,
  Tires,
  Doors
]);

var car = injector.get(Car);
```

我们从Angular 2中导入ReflectiveInjector,通过暴露一些静态的api来创建injector.resolveAndCreate()是一个工厂函数,它创建了一个injector,提供了一个provider列表.等会我们在探讨如何将class提供给providers.但现在先关注injector.get().看下最后一行的Car一个实例,我们的injector是如何知道需要哪些依赖来实例化汽车.看看Car类的实现

```js
import { Inject } from '@angular2/core';

class Car {
    constructor(
        @Inject(Engine) engine,
        @Inject(Tires) tires,
        @Inject(Doors) doors
    ){
        ...
    }
}

```
我们从框架中导入一个名为Inject的东西,并将其作为装饰器应用于我们的构造函数参数.如果你不清楚装饰器,可以阅读我们的文章[the difference between decorators and annotations ](http://blog.thoughtram.io/angular/2015/05/03/the-difference-between-annotations-and-decorators.html)和[ write Angular 2 code in ES5](http://blog.thoughtram.io/angular/2015/05/09/writing-angular-2-code-in-es5.html).

Inject装饰器将元数据附加到我们的Car类.之后会被DI系统读取.所以基本上我们做的上就是告诉DI系统构造函数第一个参数类型是Engine,第二个是Tires,第三个是Doors.如果用TypeScript写,就更好理解了

```js
class Car {
    constructor(engine: Engine, tires: Tires, doors: Doors) {
        ...
    }
}
```

我们的类声明它自己的依赖关系,DI可以读取这些信息来实例化创建Car对象所需的任何东西.但是Injector如何知道该怎么样创建所需要的对象?这就是provider的作用.还记得resolveAndCreate()方法中,我们传递了一个数组形式的类列表吗?

```js
var injector = ReflectiveInjector.resolveAndCreate([
  Car,
  Engine,
  Tires,
  Doors
]);
```
对的,这个类的列表就是一个providers列表.实际上他只是一种语法的缩写.如果把它写完整,看起来就更清晰了

```js
var injector = RelfectiveInjector.resolveAndCreate([
  { provide: Car, useClass: Car },
  { provide: Engine, useClass: Engine },
  { provide: Tires, useClass: Tires },
  { provide: Doors, useClass: Doors }
]);

```
我们有一个拥有provider属性的对象,他会映射token到配置对象上.token可以是type或者字符串,如果你现在读这些providers,会更容易理解发生了什么.我们绑定Car类型到Car类上,绑定Engine类型到Engine类上等等.这就是之前说的方法.因此使用providers,我们不仅可以让依赖注入程序知道在应用程序中使用哪些依赖项,还会配置这些依赖项的对象.

现在下一个问题就出来了:我们什么时候使用完整的语法而不是使用速记语法.我们没理由写{provide:Foo,useClass:Foo}.是的,这是正确的.这就是为什么我们开始使用速记语法.然而,更长的语法使我们能够做非常非常强大的事情.看看下一个代码段.

```js
{provide:Engine,useClass:OtherEngine}
```
对的,我们可以将token Id映射到我们想要的任何东西.在这里绑定Engine类的id到OtherEngine,这意味着,我们申请Engine类型时,我们得到一个类OtherEngine的实例

这就是强大之处了.因为这不仅为了让我们防止名称冲突,我们也可以创建一个接口的类型并将它绑定到一个具体的实现.除此之外,我们可以在一个单一的地方不接触任何其他代码使用一个token换出它实际的依赖.

Angular 2 的DI介绍了其他的provider方法,我们将在下一节讨论.

## 其他provider配置

有时,我们不想得到一个类的实例,而只是一个单一的值或工厂函数的值,需要更多的配置.这就是什么Angular 2的DI的provider不仅仅有一种方法.让我们快速了解他们

#### providing values

我们想简单的绑定一个值到{useValue:value}

```js

{provide:'some value',useValue:'Hello World'}

```
当我们想要简单的配置值时,这就很方便了

#### providing aliases

我们可以将缩写的token映射到另一个token

```js
{ provide: Engine, useClass: Engine }
{ provide: V8, useExisting: Engine }
```

#### providing factories

是的,我们亲爱的工厂函数

```js

{
  provide: Engine,
  useFactory: () => {
    if (IS_V8) {
      return new V8Engine();
    } else {
      return new V6Engine();
    }
  }
}

```
当然,工厂可能有它自己的依赖关系.通过对工厂的依赖性很容易给工厂添加一个tokens列表:

```js
provide(Engine, {
  useFactory: (car, engine) => {

  },
  deps: [Car, Engine]
})
```

## 可选依赖

@Optional装饰器,可以让我们的依赖声明变为可选.如果应用程序需要第三方库,但是这个第三方库不存在,还可以回退

```js
class Car {
    constructor(@Optional(jQuery)) {
        if (!$) {
            //set up fallback
        }
    }
}
```

正如你可以看到的,Angular 2的DI解决了我们Angular 1的DI几乎所有不好的问题.还有一个问题我们没有讲到,新的DI系统还能创建单例对象吗?答案是肯定的.

## Transient Dependencies and Child Injectors

#### (这个标题不翻译感觉比较好)

如果我们需要一个transient dependency,每次获取依赖都要创建一个新的实例,我们有2个选择:

工厂模式会返回一个类对象,而不是一个单例对象

```js
{
  provide: Engine,
  useFactory: () => {
    return () => {
      return new Engine();
    }
  }
}
```
我们也可以使用 Injector.resolveAndCreateChild() 来创建一个child injector,一个child injector在绑定一个对象实例时,将不同于老的injector的实例.

```js
var injector = ReflectiveInjector.resolveAndCreate([Engine]);
var childInjector = injector.resolveAndCreateChild([Engine]);

injector.get(Engine) !== childInjector.get(Engine);
```

事实证明,如果没有在child injector 上绑定一个token ID那么child injector将在父级injector上查找:看图

![](http://blog.thoughtram.io/images/transient-dependencies-4.svg)

这张图展示了三个injectors,其中两个是子injector.每个injector都有自己的provider配置.现在如果我们从
第二个injector获取Car类型的实例,Car对象由该child injector创建.然而,engine将会被第一个child injector创建,tires 和doors会被parent injector创建,这个有点像原型链.

我们甚至可以配置可见性的依赖关系.[在另一篇文章中讨论](http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html)

## 在Angular 2中如何使用？

现在我们已经学习了Angular 2中的DI是如何工作的,你可能想知道他是如何运用在框架中的.当我们构建Angular 2组件时,我们必须手动创建injector.幸运的是,Angular团队花费了大量的精力和时间去设计一个很好的API使得在组件中隐藏了所有injector.

让我们来看一个简单的Angular 2组件

```js
@Component({
  selector: 'app',
  template: '<h1>Hello !</h1>'

})
class App {
  constructor() {
    this.name = 'World';
  }
}
bootstrap(App);

```
(原文的代码有点老,我改了下)

这并没有什么特别的,如果你对此感到陌生,你看你想阅读我们关于Angular 2中构建[zippy](http://blog.thoughtram.io/angular/2015/03/27/building-a-zippy-component-in-angular-2.html)组件的文章

```js
class NameSerivece {
    constructor() {
        this.name = 'Pascal'
    }

    getName() {
        return this.name
    }
}

```
为了在我们的应用中使用NameSerivece,我们需要通过应用injector提供的provider配置.还需要创建一个injector

我们定义一个NgModule.@NgModule()装饰器创建程序的元数据.

```js
@NgModule({
  imports: [BrowserModule],
  providers: [NameService],
  declarations: [App],
  bootstrap: [App]
})
export class AppModule {}
```

现在要使用NameSerivce的话,直接使用@Inject就可以了

```js
class App {
  constructor(@Inject(NameService) NameService) {
    this.name = NameService.getName();
  }
}
```
或者,使用Typescript,我们只需要添加类型注释到我们构造函数就可以了

```js
class App {
    constructor(NameService:NameService) {
        this.name = NameService.getName()
    }
}

```

棒极了,一下子我们没有了任何Injector了,但是还有一件事:如果我们想在特定的组件中使用不同的依赖,我们需要怎么做?

比如说,我们有一个NameSerivce实例,在应用程序中实例类型被广泛的注入,但有一个组件需要另一个不同的NameSerivce实例,可以使用@Component的providers,它允许我们将provider添加到特定的组件中

```js
@Component({
  selector: 'app',
  providers: [
    {provide: NameService, useValue: 'Thomas' }
  ],
  template: '<h1>Hello {{name}}!</h1>'
})
class App {
  ...
}

```
## Demo

<iframe style="width: 100%; height: 450px" src="http://embed.plnkr.co/EiGotX/?deferRun"allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## End

文章是去年的,正篇看下来真的好难理解.水平有限翻的不好.
