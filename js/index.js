(function (d, w, $) {
    "use strict";
    class app {
        constructor() {
            let _ = this;
            let eventCount = 0;
            _.ls = w.localStorage;
            let searchInterval = 0;
            let x2js = new X2JS();
            let searchData = false;
            let previousInputData = '';
            this.init = function () {
                $('.nav_box').off().on('click', _.toggleNav);
                $('.nav_box_bottom').off().on('click', _.toggleNav);
                $('.nav_list_wrap').off().on('click', _.toggleNav);
                $(w).on('scroll', _.detectScroll);
                $('.light a').on('click', _.switchLight);
                $('.switch_light_bottom').on('click', _.switchLight);
                _.initLight();
                if (_.ls.getItem('followSystemLighting') == '1') {
                    _.followSystemLighting();
                }
                $('.js-search-input').on('focus', _.startSearchMonitoring)
                $('.js-search-input').on('blur', _.stopSearchMonitoring)
                _.getSearchData()
                $('.js-search').on('click', _.showSearch)
                $('.close_area').on('click', _.hideSearch)
            }
            this.preventClose = function (e) {
                e.stopPropagation();
                return false
            }
            this.hideSearch = function () {
                $('.search-wrap').removeClass('on')
                $('.search-body ul').html('')
                $('.js-search-input').val('')
            }
            this.showSearch = function () {
                $('.search-wrap').addClass('on')
                $('.js-search-input').focus()
            }
            this.getSearchData = function () {
                $.ajax({
                    url: '/atom.xml',
                    dataType: 'xml',
                    success: function (res) {
                        searchData = x2js.xml2json(res);
                    },
                    error: function () {
                        _.getSearchData()
                    }
                })
            }
            this.stopSearchMonitoring = function () {
                window.clearInterval(searchInterval);
            }
            this.startSearchMonitoring = function () {
                let obj = $(this)
                searchInterval = setInterval(function () {
                    let inputData = obj.val();
                    inputData = inputData.toLowerCase();
                    if (!searchData) {
                        console.log('搜索数据正在加载中...');
                        return false
                    }
                    if (!inputData) {
                        $('.search-body ul').html('')
                        return false
                    }
                    if (inputData == previousInputData) {
                        return false
                    } else {
                        $('.search-body ul').html('')
                    }

                    for (let i = 0; i < searchData.feed.entry.length; i++) {
                        let article_item = searchData.feed.entry[i];
                        let content = article_item.content.toString();
                        content = content.toLowerCase();
                        let title = article_item.title;
                        let title_lowercase = title.toLowerCase();
                        let link = article_item.link._href;

                        if (content.includes(inputData)) {
                            $('.search-body ul').append(`<li><a href="${link}">${title}</a></li>`);
                        } else if (title_lowercase.includes(inputData)) {
                            $('.search-body ul').append(`<li><a href="${link}">${title}</a></li>`);
                        }
                    }

                    previousInputData = inputData;
                }, 300);
            }
            this.followSystemLighting = function () {
                $('.switch_light_bottom').hide();
                _.ls.setItem('followSystemLighting', 1);
                setInterval(function () {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        $('body').addClass('dark');
                        _.ls.setItem('dark', 1);
                    } else {
                        $('body').removeClass('dark');
                        _.ls.setItem('dark', 0);
                    }
                }, 300);
            }
            this.initLight = function () {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    if (!$('body').hasClass('dark')) {
                        setTimeout(function () {
                            let c = confirm('检测到您已启用暗黑模式，是否需要跟随系统设置？');
                            if (c) {
                                _.switchLight();
                                _.followSystemLighting();
                            }
                        }, 1000);
                    }
                }
            }
            this.scrollEvent = function (data) {
                if (data.length == 1) {
                    $('.special_enevts ._block').eq(0).html(data[0]);
                    return false;
                }
                let index = eventCount % 4;
                $('.special_enevts ._block').eq(index).html(data[eventCount]);
                $('.special_enevts').css({
                    'transform': 'rotateX(' + (eventCount * 90) + 'deg)'
                });
                setTimeout(function () {
                    eventCount++;
                    if (data.length == eventCount) {
                        eventCount = 0;
                    }
                    _.scrollEvent(data);
                }, 5000);
            }
            this.toggleNav = function () {
                if ($('body').hasClass('nav_view')) {
                    $('body').removeClass('nav_view');
                } else {
                    $('body').addClass('nav_view');
                }
            }
            this.switchLight = function () {
                $('body').addClass('t');
                if ($('body').hasClass('dark')) {
                    $('body').removeClass('dark');
                    _.ls.setItem('dark', 0);
                } else {
                    $('body').addClass('dark');
                    _.ls.setItem('dark', 1);
                }
            }
            this.detectScroll = function () {
                let st = $(w).scrollTop();
                if (st > 50) {
                    if ($('body').hasClass('show_bottom_nav')) {
                        return false;
                    }
                    $('body').addClass('show_bottom_nav');
                }
                if (st < 50) {
                    if (!$('body').hasClass('show_bottom_nav')) {
                        return false;
                    }
                    $('body').removeClass('show_bottom_nav');
                }
            }
        }
    }
    app = new app();
    app.init();
})(document, window, jQuery)