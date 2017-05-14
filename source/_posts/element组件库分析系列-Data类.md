---
title: element组件库分析系列--Data类
date: 2017-05-14 00:43:06
tags:
    - javascript
    - Vue.js
---

## element组件库分析系列--Data类

由于组件中多多少少会用到Utils下一些工具类,所以打算先分析Utils中平常项目常见的工具类,先充data.js开始

<!--more-->

### data.js

这个处理时间格式的js文件足足有344行,是我见过处理时间最详细的方式.我采用直接注释源码的方式

```js
//这里忽略了开源信息

// 总体用了常见的立即执行函数 IFFE()

/*eslint-disable*/
// 把 YYYY-MM-DD 改成了 yyyy-MM-dd
(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class fecha
   */
  var fecha = {};
  // 匹配1-4个数字,1-4个M,yy或者yyyy,1-4个S,Do,ZZ,HH,hh,MM,ss,DD,mm,a和A,''里的内容,""里的内容... 真的复杂
  var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  // 匹配1-2位数字 相等于/d{1,2}???
  var twoDigits = /\d\d?/;
  // 匹配3位数字
  var threeDigits = /\d{3}/;
  // 匹配4位数字
  var fourDigits = /\d{4}/;
  //这句没有看懂...
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var noop = function () {
  };
  /**
   * shorten是缩短的意思,我理解他是将需要运算的数值,缩短到一定的长度 ex:MonDay => Mon
   * @param {*} arr 需要缩短的数组
   * @param {*} sLen //需要缩短的长度
   */
  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }
  /**
   * 转换英文日期对应的数字
   * @param {*} arrName 转换的数据 
   */
  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());//数值的前两位,结合情况具体分析
      if (~index) {
        //这里用了 ~按位非 操作符,感觉有点炫技..
        d.month = index;
      }
    };
  }

  /**
   * 统一风格,将日期,月份,时间小于10的加上0的前缀.ex:1 => 01
   * @param {*} val 加0前缀的数值 
   * @param {*} len 数值长度
   */
  function pad(val, len) {
    val = String(val);
    len = len || 2;gaobaiqiqiu
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3); //取月份前三位
  var dayNamesShort = shorten(dayNames, 3); //取日期前三位
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10]; //给日期加后缀.ex: 1 => 1st %操作符优先级高于加减乘除
    }
  };

  var formatFlags = {
    D: function(dateObj) {
      return dateObj.getDay();//返回星期里的某一天 0-6
    },
    DD: function(dateObj) {
      return pad(dateObj.getDay()); //返回星期里的某一天 00-06
    },
    Do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate()); //返回月份具体某一天 ex: 2nd
    },
    d: function(dateObj) {
      return dateObj.getDate(); //返回月份里第几天
    },
    dd: function(dateObj) {
      return pad(dateObj.getDate()); //返回月份里第几天
    },
    ddd: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()]; //返回具体某一天对应的英文缩写 ex: 1 => Mon
    },
    dddd: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()]; //返回具体某一天对应英文全称 ex: 1 => MonDay
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1; //返回具体月份
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1); //返回具体月份 ex: 01
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()]; //返回具体月份的英文缩写 1 => Jan
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()]; //返回具体月份的英文全称 1 => January
    },
    yy: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2); //将年份转为字符串,取后两位 2017 => 17
    },
    yyyy: function(dateObj) {
      return dateObj.getFullYear(); //取完整年份
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12; // 12小时制
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12); // 12小时制 加0前缀
    },
    H: function(dateObj) {
      return dateObj.getHours(); //24小时制
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours()); //24小时制 加前缀
    },
    m: function(dateObj) {
      return dateObj.getMinutes(); // 分钟
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes()); //加0前缀分钟
    },
    s: function(dateObj) {
      return dateObj.getSeconds(); //秒
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds()); //加0前缀秒
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100); // 一位毫秒数
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2); //两位毫秒数
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3); // 三位毫秒数
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1]; // 返回上下午
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase(); // 返回上下午 大小写
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4); //时区偏移
    }
  };


  //匹配不同的解析
  var parseFlags = {
    d: [twoDigits, function (d, v) {
      d.day = v;
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    yy: [twoDigits, function (d, v) {
      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    yyyy: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    D: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.DD = parseFlags.D;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.Do = parseFlags.dd = parseFlags.d;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;


  // Some common format strings
  // 通用的格式
  fecha.masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss',
    shortDate: 'M/D/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'dddd, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   */
  fecha.format = function (dateObj, mask, i18nSettings) {
    // 设置数据格式
    var i18n = i18nSettings || fecha.i18n;

    // 实例化Date类
    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }
    // 检测类型 Object.prototype.toString.call() 这个检测类型的方法很好用
    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date in fecha.format');
    }

    // 设置通用格式???
    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    // 使用对应的格式化方法???
    return mask.replace(token, function ($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @returns {Date|boolean}
   */
  fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
      throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0]; //对应解析方法
        var index = dateStr.search(info[0]); //查找对应匹配
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n); //对应函数处理
            dateStr = dateStr.substr(index + result.length); //截取长度
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    //处理12小时制
    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    //时区偏移
    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fecha;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return fecha;
    });
  } else {
    main.fecha = fecha;
  }
})(this);

```

## End

下次尝试分析第一个组件Alert

