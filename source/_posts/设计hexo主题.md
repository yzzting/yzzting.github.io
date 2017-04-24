title: 设计hexo主题
date: 2016-03-20 11:54:13
layout: post
comments: true
---
# 自主研发一款hexo主题

之前在杨滋滋的[年度计划](http://www.yzz1995.cn/2015/12/30/%E6%9D%A8%E6%BB%8B%E6%BB%8B2015%E5%B9%B4%E5%BA%A6%E6%80%BB%E7%BB%93/)里面,写到第一个计划就是自己设计一款hexo的主题,所以才有了这款[MyFairLady](https://github.com/yzzting/hexo-theme-MyFairLady)粉红主题

## 0x00

一开始的设计初衷，是没有想过要把他做得这么粉红。想用最简单的黑白灰三种颜色来做，可是后来呢，发觉实在是有点太单调了。不是很好看，所以想换个颜色，Ctrl+Alt+C 打开调色板选到了粉红色rgba(246,74,182,.66);

## 0x01

进入正题，这里其实是一篇中文文档。

<!-- more -->


### 安装

    $ git clone https://github.com/yzzting/hexo-theme-MyFairLady.git

修改你hexo主目录下的_config.yml的theme

    # Extensions
    ## Plugins: http://hexo.io/plugins/
    ## Themes: http://hexo.io/themes/
    theme: MyFairLady

### 主要的配置

#### 菜单

    menu:
        home: /
        about me : /about
        archives: /archives

这个是header里面三个选项，如果要添加的话，在目录下的 source 下创建 一个你想要添加的选项，例如**xx.md**里面填入        

    ---
    layout: page
    title: "xx"
    noDate: "true"
    ---

#### 显示的文章数

每一页显示的文章数，还是在主目录下的_config.yml，找到```per_page```,选择你喜欢的数字。归档页也会跟着改变。

    # Pagination
    ## Set per_page to 0 to disable pagination
    per_page: 5

#### 统计

我在里面添加了百度统计和google统计，默认才用的是google。分别在主题的配着文件下填入你的ID，就是启用了

    # Baidu Analytics
    # baidu_analytics: c21994907883f37ffd80e13627dd4faa

    # Google Analytics
    google_analytics: UA-75314797-1

#### 社交

在主题的_config.yml里面的subnav选项中，有三个选项，github，知乎，微博，一切从简，并没有用icon。（其实是实在找不到什么font-awesome，有知乎的logo

    # SubNav
    subnav:
    gitHub: "https://github.com/yzzting"
    weiBo: "http://weibo.com/yzzting"
    zhiHu: "https://www.zhihu.com/people/yang-zi-zi-1995"

其他的配置呢在配置文件里面写的也蛮清楚了，一看就懂的啦

### 0x02

这款主题用了ejs+less，只是一点点js而已。这个主题粉红色调，以简洁的白色和粉红色看起来更简洁，清楚，所以我借了一部电影，它被命名为**窈窕淑女**的名称，也希望大家可以给出宝贵的意见和建议，来帮助我改正。也欢迎大家star和fork这个主题，给宝宝一个小小的鼓励
