### 安装

    $ git clone https://github.com/yzzting/hexo-theme-MyFairLady.git MyFairLady

修改你hexo主目录下的_config.yml的theme

    # Extensions
    ## Plugins: http://hexo.io/plugins/
    ## Themes: http://hexo.io/themes/
    theme: MyFairLady

### 主要的配置

#### 菜单

    # Header
    menu:
        主页 : /
        关于 : /about
        分类 : /tags
        归档 : /archives

这个是header里面三个选项，如果要添加的话，在目录下的 source 下创建 一个你想要添加的选项名称的文件夹，然后在里面new一个例如**xx.md**在里面填入

    ---
    layout: xxx
    title: "xx"
    noDate: "true"
    ---

ex:(tags/index.md)

    ---
    layout: category
    title: "tags"
    noDate: "true"
    ---


#### 显示的文章数

每一页显示的文章数，还是在主目录下的_config.yml，找到```per_page```,选择你喜欢的数字。归档页也会跟着改变。

    # Pagination
    ## Set per_page to 0 to disable pagination
    per_page: 5

#### 统计

我在里面添加了百度统计和google统计，默认才用的是google。分别在主题的配着文件下填入你的ID，就是启用了(如果宝宝需要翻墙的ss服务的话，可以找我

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

#### 评论框

因为多说的评论框，样式很low，所以我只是采用了disqus。虽然是国外的，但是不影响我们使用。注册和配置相当容易，不懂可以找我。注册填入你的网站信息之后，在主题的配置文件.config.yml 中填入

    # comments
    disqus: yzzting

### 0x02

这款主题用了ejs+scss，只是一点点js而已。这个主题粉红色调，以简洁的白色和粉红色看起来更简洁，清楚，所以我借了一部电影，它被命名为**窈窕淑女**的名称，也希望大家可以给出宝贵的意见和建议，来帮助我改正。也欢迎大家star和fork这个主题，给宝宝一个小小的鼓励

### 0x03

如遇到问题或有需求，可以：

* 提issue给我
* 在这个文章下留言[设计hexo
主题](http://www.yzz1995.cn/2016/03/20/%E8%AE%BE%E8%AE%A1hexo%E4%B8%BB%E9%A2%98/)
* 直接邮件联系我

我都会认真对待
