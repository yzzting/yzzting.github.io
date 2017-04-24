(function (window) {

    'use strict';

    var Yzz = {};


    Yzz.toc = function () {
        var HEADERFIX = 30;
        var $toclink = $('.toc-link'),
            $headerlink = $('.headerlink');

        var headerlinkTop = $.map($headerlink, function (link) {
            return $(link).offset().top;
        });

        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();

            for (var i = 0; i < $toclink.length; i++) {
                var isLastOne = i + 1 === $toclink.length,
                    currentTop = headerlinkTop[i] - HEADERFIX,
                    nextTop = isLastOne ? Infinity : headerlinkTop[i + 1] - HEADERFIX;

                if (currentTop < scrollTop && scrollTop <= nextTop) {
                    $($toclink[i]).addClass('active');
                } else {
                    $($toclink[i]).removeClass('active');
                }
            }
        });
    }
    window.Yzz = Yzz;
})(window)

$(document).ready(function () {

    Yzz.toc();
});