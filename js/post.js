(function (d, w, $) {
    "use strict";
    class app {
        constructor() {
            let _ = this;
            let tips_count = 0;
            let ajaxPageLoad = {
                abort: function () {}
            };
            let searchInterval = 0;
            let x2js = new X2JS();
            let searchData = false;
            let previousInputData = '';
            _.winWidth = $(w).width();
            _.xss = filterXSS;
            _.ls = w.localStorage;
            _.currentPageID = $('input.currentPageID').val();
            _.mk = marked;
            _.articleList = {};
            this.init = function () {
                _.mk.setOptions({
                    "baseUrl": null,
                    "breaks": false,
                    "gfm": true,
                    "headerIds": true,
                    "headerPrefix": "",
                    "highlight": null,
                    "langPrefix": "",
                    "mangle": true,
                    "pedantic": false,
                    "sanitize": false,
                    "sanitizer": null,
                    "silent": false,
                    "smartLists": false,
                    "smartypants": false,
                    "xhtml": false
                });
                $(d).on('click', '.settings_input', _.switchSettings);
                $(d).on('click', '.quit_login', _.quitLogin);
                $(d).on('click', '.js_do._delete', _.deleteThisComment);
                $(d).on('click', '.js_do._cmt', function () {
                    _.toggleCommentView('reply', $(this));
                });
                $('.preview.comp').off().on('click', function () {
                    _.commentAct('preview');
                });
                $('.publish.comp').off().on('click', function () {
                    if ($(this).hasClass('_reply')) {
                        _.commentAct('reply');
                    } else if ($(this).hasClass('publish')) {
                        _.commentAct('publish');
                    }
                });
                $('.preview_title .close').off().on('click', _.closePreview);
                $('.js_do._art').off().on('click', function () {
                    _.toggleCommentView('comment');
                });
                $('.comment_close').off().on('click', _.toggleCommentView);
                $(d).on('click', '.article_out.only img:not(.ignore_js)', _.imgOut);
                $('.img_wrap_box').off().on('click', _.hideIMGDetail);
                $(w).on('resize', _.updateParam);
                $('.login_with_github').off().on('click', _.login);
                _.getUser();
                $('.nav_box').off().on('click', _.toggleNav);
                $('.nav_list_wrap').off().on('click', _.toggleNav);
                $(w).on('scroll', _.detectScroll);
                $('.light a').on('click', _.switchLight);
                $('.nav_box_bottom').off().on('click', _.toggleNav);
                $('.switch_light_bottom').on('click', _.switchLight);
                // $('#disqus_thread').on('click', _.initDisqus);
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
            this.initDisqus = function () {
                $('#disqus_thread').html('').addClass('on');
                let d = document,
                    s = d.createElement('script');
                s.src = 'https://yi-ge-qiu.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            }
            this.login = function () {
                let path = w.location.pathname;
                let host = w.location.host;
                if (host != 'jw12138.com' && host != '127.0.0.1') {
                    _.showTips({
                        text: '此页面可能被置于其他域名/服务器中，为了安全起见，请您在浏览器中手动输入 https://jw12138.com 进行登录。',
                        type: 'error',
                        duration: 10000
                    });
                    return false;
                }
                w.location = `https://api.jacky97.top/github/?pathname=${path}&host=${host}`
            }
            this.toggleLoginBtn = function (show) {
                if (show == undefined) {
                    $('.login_with_github').show();
                }
                if (show == false) {
                    $('.login_with_github').hide();
                }
            }
            this.hl = function (father) {
                if (!father) {
                    father = '';
                }
                $(`${father} pre code`).each(function () {
                    hljs.highlightBlock($(this)[0])
                });
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
            this.switchLight = function () {
                $('body').addClass('t');
                if ($('body').hasClass('dark')) {
                    $('body').removeClass('dark');
                    _.ls.setItem('dark', 0);
                    if ($('#disqus_thread').hasClass('on')) {
                        _.initDisqus();
                    }
                } else {
                    $('body').addClass('dark');
                    _.ls.setItem('dark', 1);
                    if ($('#disqus_thread').hasClass('on')) {
                        _.initDisqus();
                    }
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
            this.toggleNav = function () {
                if ($('body').hasClass('nav_view')) {
                    $('body').removeClass('nav_view');
                } else {
                    $('body').addClass('nav_view');
                }
            }
            this.updateParam = function () {

            }
            this.hideIMGDetail = function () {
                let obj = $(this);
                obj.removeClass('on');
                let st = setTimeout(function () {
                    obj.removeClass('up').find('img.detailed_img').attr({
                        'src': '',
                        'style': ''
                    }).removeClass('t');
                    $('.img_wrap_box .img_loading').removeClass('done');
                    $('body').css({
                        overflow: 'auto'
                    });
                }, 300);
            }
            this.imgOut = function () {
                let src = $(this).attr('src');
                let nw = $(this)[0].naturalWidth;
                let nh = $(this)[0].naturalWidth;
                if (nw < 200) {
                    nw = nw * 3;
                }
                if (nh > $(w).height()) {
                    nw = 'auto';
                }
                $('.img_wrap_box').addClass('on up');
                $('.img_wrap_box .img_loading');
                $('.img_wrap_box .detailed_img').attr({
                    src: src
                }).css({
                    width: nw
                });
                $('.img_wrap_box .detailed_img').off('load').on('load', function () {
                    $('.img_wrap_box .detailed_img').addClass('t')
                    $('.img_wrap_box .img_loading').addClass('done');
                });
                $('body').css({
                    overflow: 'hidden'
                });
            }
            this.confirmOn = function (obj) {
                if (!obj || !obj.text || !obj.fun) {
                    return false
                }
                $('.confirm_box_wrap').addClass('on up');
                $('.confirm_box_title').html(obj.text);
                $('.confirm_box_btn ._cancel').off('click').on('click', function () {
                    $('.confirm_box_wrap').removeClass('on');
                    let t8 = setTimeout(function () {
                        $('.confirm_box_wrap').removeClass('up');
                    }, 300);
                })
                $('.confirm_box_btn ._accecpt').off('click').on('click', function () {
                    $('.confirm_box_wrap').removeClass('on');
                    let t8 = setTimeout(function () {
                        $('.confirm_box_wrap').removeClass('up');
                        obj.fun(obj.dom);
                    }, 300);
                })
            }
            this.deleteThisComment = function () {
                let $this = $(this);
                let todo = function (dom) {
                    let user = _.verifyUser();
                    let comment_user = dom.this.parents('.comment_li').attr('data-user-id');
                    let same_guy = user.id == comment_user;
                    let scrollTop = $(w).scrollTop();
                    if (!same_guy) {
                        _.showTips({
                            text: '只能删除自己的评论'
                        });
                        return false;
                    }
                    let comment_id = dom.this.parents('.comment_li').attr('id');
                    $.ajax({
                        url: 'https://api.jacky97.top/cmt.php',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            c_id: comment_id,
                            c_user_id: comment_user,
                            action: 'delete'
                        },
                        success: function (res) {
                            if (!res.success) {
                                _.showTips({
                                    text: '服务器遇到点问题',
                                    type: 'error'
                                });
                                return false;
                            }
                            _.showTips({
                                text: '删除成功！'
                            });
                            _.getComments(scrollTop);
                        },
                        error: function (e) {
                            _.showTips({
                                text: '删除失败了，稍后再试一下？',
                                type: 'error'
                            });
                        }
                    });
                }
                _.confirmOn({
                    text: '确定要删除吗？删除后，评论将不可恢复！',
                    fun: todo,
                    dom: {
                        this: $this
                    }
                });
            }
            this.countComment = function () {
                if ($('.comment_wrap .comment_li').length == 0) {
                    $('.no_comment').show();
                } else {
                    $('.no_comment').hide();
                }
            }
            this.toggleCommentView = function (action, obj) {
                let user = _.verifyUser();
                if (action == 'close') {
                    $('.comment_box_wrap').removeClass('on');
                    $('body').removeClass('inwidget');
                    let t = setTimeout(function () {
                        $('.comment_box_wrap').css({
                            top: '-99999px'
                        });
                    }, 300);
                    return false;
                }
                if (!user) {
                    _.showTips({
                        text: '请您先登录'
                    });
                    return false;
                }
                if ($('.comment_box_wrap').hasClass('on')) {
                    $('.comment_box_wrap').removeClass('on');
                    $('body').removeClass('inwidget');
                    let t = setTimeout(function () {
                        $('.comment_box_wrap').css({
                            top: '-99999px'
                        });
                    }, 300);
                } else {
                    $('.comment_box_wrap').addClass('on').css({
                        top: 0
                    });
                    $('#cmt').focus();
                    $('body').addClass('inwidget');
                }
                if (action == 'reply') {
                    let reply_user = obj.parents('.comment_li').find('.username span').eq(0).text();
                    let reply_user_id = obj.parents('.comment_li').attr('data-user-id');
                    let reply_user_href = obj.parents('.comment_li').attr('data-user-html-url');
                    let reply_id = obj.parents('.comment_li').attr('id');
                    $('.comment_title span').text(`回复给 ${reply_user}`);
                    $('.publish.comp').addClass('_reply');
                    $('.publish.comp._reply').attr({
                        'data-reply-user': reply_user,
                        'data-reply-user_id': reply_user_id,
                        'data-reply-user_url': reply_user_href,
                        'data-reply-id': reply_id,
                    });
                }
                if (action == 'comment') {
                    $('.comment_title span').text(`发表您的评论`);
                    $('.publish.comp').removeClass('_reply');
                }
            }
            this.switchSettings = function () {
                if ($(this).attr('data-checked') == '1') {
                    $(this).attr({
                        'data-checked': 0
                    });
                } else {
                    $(this).attr({
                        'data-checked': 1
                    });
                }
            }
            this.getLoggedInUser = function (p) {
                if (p != 'user') {
                    _.getComments();
                }
                let user = _.verifyUser();
                if (!user) {
                    $('.comment_after').hide();
                    return false;
                }
                _.attachUser(user);
            }
            this.quitLogin = function () {
                let todo = function () {
                    $('.comment_after .username a.user_html_url').attr({
                        'href': ''
                    });
                    $('.comment_after .username a.user_html_url span').html('');
                    _.ls.removeItem('user');
                    _.toggleLoginBtn();
                    _.showTips({
                        text: '您已退出登录！'
                    });
                    $('.comment_li .js_do._delete').remove();
                    $('.comment_after .username').hide();
                    $('.comment_li.comment_after').hide();
                }
                _.confirmOn({
                    text: '确定要退出登录吗？',
                    fun: todo
                });
            }
            this.resetConfirmOn = function () {
                $('.confirm_box_wrap').removeClass('on up');
                $('.confirm_box_title').html('');
            }
            this.attachUser = function (user) {
                $('.comment_after').show();
                $('.username a.user_html_url').attr({
                    href: user.html_url
                });
                $('.username a.user_html_url span').html(user.login);
                $('.username').show();
                if (_.verifyUser()) {
                    _.updatePermission();
                }
            }
            this.updatePermission = function () {
                let current_user = _.verifyUser().id;
                if (!current_user) {
                    return false;
                }
                let delete_btn = `<a href="javascript:;" class="js_do _delete" title="删除">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                    </a>`;
                $('.comment_li').each(function () {
                    if ($(this).hasClass('comment_after')) {
                        return;
                    }
                    $(this).find('.comment_widget').append(delete_btn);
                });
            }
            this.saveUser = function (id, login, html_url, email) {
                $.ajax({
                    url: 'https://api.jacky97.top',
                    data: {
                        action: 'save_user',
                        user_id: id,
                        user_login: login,
                        user_html_url: html_url,
                        user_email: email
                    },
                    type: 'POST',
                    success: function (res) {
                        _.st2_fun($('.tip_stand_by_1'), 500);
                        if (res.success) {
                            let user = {
                                id: res.user_id,
                                login: login,
                                html_url: html_url
                            }
                            _.ls.removeItem('user');
                            let timestamp = Date.now();
                            user.loginTime = timestamp;
                            _.attachUser(user);
                            _.showTips({
                                text: `欢迎您， ${user.login}`,
                                duration: 5000,
                                type: 'success'
                            });
                            _.toggleLoginBtn(false);
                            user = JSON.stringify(user);
                            _.ls.setItem('user', user);
                            _.getComments();
                        } else {
                            _.showTips({
                                text: '用户信息保存失败了，服务器可能出了点问题，要不再试一下？🤔！',
                                duration: 84000,
                                type: 'error'
                            });
                        }
                    },
                    error: function (e) {
                        console.log(e);
                        _.st2_fun($('.tip_stand_by_1'), 2000);
                        _.showTips({
                            text: '用户信息保存失败了，重新登陆一下试试？🤔',
                            duration: 6000,
                            type: 'error'
                        });
                    }
                });
            }
            this.getUser = function (p) {
                let token = _.ls.getItem('t');
                if (!token) {
                    _.getLoggedInUser(p);
                    return false;
                }
                _.toggleLoginBtn(false);
                _.showTips({
                    text: '正在与GitHub.com连线中...',
                    type: 'standby',
                    eventClass: 'tip_stand_by_1'
                });
                w.scrollTo({
                    top: 99999,
                    left: 0,
                    behavior: 'smooth'
                });
                $.ajax({
                    url: 'https://api.github.com/user',
                    type: 'GET',
                    beforeSend: function (r) {
                        r.setRequestHeader("accept", 'application/json');
                        r.setRequestHeader("Authorization", `token ${token}`);
                        $('.loading_comment').css({
                            'display': 'flex'
                        });
                    },
                    success: function (res) {
                        if (res.login) {
                            _.saveUser(res.id, res.login, res.html_url, res.email);
                            _.ls.removeItem('t');
                        } else {
                            _.toggleLoginBtn();
                            _.showTips({
                                text: '获取用户信息失败，或许可以再试一次？',
                                duration: 5000,
                                type: 'error'
                            });
                        }
                    },
                    error: function (e) {
                        _.toggleLoginBtn();
                        _.showTips({
                            text: '获取用户信息失败，或许可以再试一次？',
                            duration: 5000,
                            type: 'error'
                        });
                    }
                });
            }
            this.closePreview = function () {
                $('.preview_box').removeClass('on');
                let t = setTimeout(function () {
                    $('.preview_content').html('加载中...');
                }, 300);
            }
            this.commentAct = function (act) {
                let user = _.verifyUser();
                if (!user) {
                    return false;
                }
                let md = $.trim($('#cmt').val());
                if (md.length > 16384) {
                    _.showTips({
                        text: '字符数太多啦！试试删除无用字符，或者逐条发送。'
                    });
                    return false;
                }
                if (md.length < 1) {
                    _.showTips({
                        text: '写点啥呗，一个句号都可以'
                    });
                    return false;
                }
                if (act == 'preview') {
                    $('.preview_box').addClass('on');
                    let res = _.xss(_.mk(md));
                    $('.preview_content').html(res);
                    _.hl('.preview_content');
                    $('.preview_content')[0].scrollTo(0, 0);
                }

                if (act == 'publish') {
                    $('.comment_box_wrap').addClass('disabled');
                    $.ajax({
                        url: 'https://api.jacky97.top/md.php',
                        type: 'post',
                        data: {
                            action: act,
                            c_content_md: md,
                            c_content_html: _.xss(_.mk(md)),
                            c_user_id: user.id,
                            c_user_login: user.login,
                            c_user_href: user.html_url,
                            c_page: _.currentPageID
                        },
                        timeout: 10000,
                        success: function (res) {
                            if (res.success) {
                                let data = [];
                                data.push(res);
                                _.renderComments(data, function () {});
                                $('.comment_box_wrap').removeClass('disabled');
                                _.toggleCommentView('close');
                                _.showTips({
                                    text: '发布成功'
                                })
                                _.countComment();
                                $('#cmt').val('');
                            } else {
                                $('.comment_box_wrap').removeClass('disabled');
                                _.showTips({
                                    text: '服务器遇到点问题，稍后再试一下？',
                                    type: 'error'
                                })
                            }
                        },
                        error: function (e) {
                            $('.comment_box_wrap').removeClass('disabled');
                            _.showTips({
                                text: '服务器遇到点问题，稍后再试一下？',
                                type: 'error'
                            })
                        }
                    });
                }

                if (act == 'reply') {
                    $('.comment_box_wrap').addClass('disabled');
                    let c_reply = $('.publish.comp._reply').attr('data-reply-user_id');
                    let c_reply_login = $('.publish.comp._reply').attr('data-reply-user');
                    let c_reply_html_url = $('.publish.comp._reply').attr('data-reply-user_url');
                    let c_reply_id = $('.publish.comp._reply').attr('data-reply-id');
                    $.ajax({
                        url: 'https://api.jacky97.top/md.php',
                        type: 'post',
                        data: {
                            action: act,
                            c_content_md: md,
                            c_content_html: _.xss(_.mk(md)),
                            c_user_id: user.id,
                            c_user_login: user.login,
                            c_user_href: user.html_url,
                            c_page: _.currentPageID,
                            c_reply: c_reply,
                            c_reply_login: c_reply_login,
                            c_reply_html_url: c_reply_html_url,
                            c_reply_id: c_reply_id
                        },
                        timeout: 10000,
                        success: function (res) {
                            if (res.success) {
                                let data = [];
                                data.push(res);
                                _.renderComments(data, function () {});
                                $('.comment_box_wrap').removeClass('disabled');
                                _.toggleCommentView('close');
                                _.showTips({
                                    text: '发布成功'
                                })
                                _.countComment();
                            } else {
                                $('.comment_box_wrap').removeClass('disabled');
                                _.showTips({
                                    text: '服务器遇到点问题，稍后再试一下？',
                                    type: 'error'
                                })
                            }
                        },
                        error: function (e) {
                            $('.comment_box_wrap').removeClass('disabled');
                            _.showTips({
                                text: '服务器遇到点问题，稍后再试一下？',
                                type: 'error'
                            })
                        }
                    });
                }

            }
            this.resetComments = function () {
                $('body').removeClass('in_article');
                $('.comment_wrap').html('');
                $('.loading_comment').hide();
                $('.login_with_github').hide();
                $('.no_comment').hide();
            }
            this.getComments = function (st) {
                ajaxPageLoad.abort();
                $('.comment_wrap').html('');
                ajaxPageLoad = $.ajax({
                    url: 'https://api.jacky97.top/cmt.php',
                    dataType: 'json',
                    data: {
                        action: 'get_comments',
                        page_id: _.currentPageID
                    },
                    beforeSend: function () {
                        $('.loading_comment').css({
                            'display': 'flex'
                        });
                    },
                    success: function (res) {
                        if (!res.success) {
                            return false;
                        }
                        $('.comment_wrap').html('');
                        _.renderComments(res.data, function () {
                            $('.loading_comment').hide();
                        }, st);
                    }
                });
            }
            this.htmlEncode = function (html) {
                let temp = document.createElement("div");
                (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
                let output = temp.innerHTML;
                temp = null;
                return output;
            }
            this.renderComments = function (data, fn, st) {
                for (let i = 0; i < data.length; i++) {
                    let ele = data[i];
                    if (typeof ele != 'object') {
                        ele = JSON.parse(ele);
                    }
                    let current_user = _.verifyUser()
                    let same_guy = false;
                    if (current_user) {
                        same_guy = current_user.id == ele.c_user_id
                    }
                    let isAuthor = '';
                    let isAuthor_inreply = '';
                    if (data[i].c_user_login == 'jw-12138') {
                        isAuthor = `<span class="isAuthor">作者</span>`;
                    }
                    if (data[i].c_reply_login == 'jw-12138') {
                        isAuthor_inreply = `<span class="isAuthor">作者</span>`;
                    }
                    let delete_btn = '';
                    let reply_to = '';
                    let content = ele.c_content;
                    let html_reply_id = '';
                    let html_reply_class = '';
                    let html_reply_father_deleted = '';
                    if (ele.c_reply_id) {
                        html_reply_id = `data-reply_id="${ele.c_reply_id}"`;
                        html_reply_class = 'isReply';
                        if ($(`#${ele.c_reply_id}`).length == 0) {
                            html_reply_father_deleted = '<div class="deleted_tag">前一条评论已删除</div>';
                        }
                    }
                    content = _.xss(content);
                    if (same_guy) {
                        delete_btn = `<a href="javascript:;" class="js_do _delete" title="删除">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                        </a>`;
                    }
                    if (ele.c_reply) {
                        reply_to = `<span class="comment_to"> 回复 </span>
                            <a href="${ele.c_reply_html_url}" target="_blank" rel="noopener" title="在新页标签查看${ele.c_reply_login}的GitHub首页">
                                <div class="username">
                                    @<span class="user">${ele.c_reply_login}</span>${isAuthor_inreply}
                                </div>
                            </a>`;
                    }
                    let html_ele = `<div class="comment_li ${html_reply_class}" id="${ele.c_id}" data-user-id="${ele.c_user_id}" data-user-html-url="${ele.c_user_href}" ${html_reply_id}>
                        ${html_reply_father_deleted}
                        <div class="comment_user">
                            <a href="${ele.c_user_href}" target="_blank" rel="noopener" title="在新页标签查看${ele.c_user_login}的GitHub首页">
                                <div class="username">
                                    @<span class="user">${ele.c_user_login}</span>${isAuthor}
                                </div>
                            </a>
                            ${reply_to}
                            <div class="comment_time">
                                ${ele.c_created_at}
                            </div>
                        </div>
                        <div class="comment_content article_out">
                            ${content}
                        </div>
                        <div class="comment_widget">
                            <a href="javascript:;" class="js_do _cmt" title="回复">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/><path d="M0 0h24v24H0z" fill="none"/></svg> <span class="hide">回复</span>
                            </a>
                            ${delete_btn}
                        </div>
                    </div>`;
                    $('.comment_wrap').prepend(html_ele);
                    $('.comment_wrap .comment_content a').attr({
                        target: '_blank',
                        rel: 'nofollow'
                    });
                }
                _.hl('.comment_wrap')
                if (data.length == 0) {
                    $('.no_comment').show();
                }
                fn();
                w.scrollTo({
                    top: st,
                    left: 0
                });
            }
            this.verifyUser = function () {
                let user = _.ls.getItem('user');
                if (!user) {
                    _.toggleLoginBtn();
                    return false;
                }
                user = JSON.parse(user);
                let timestamp = Date.now();
                if (timestamp - user.loginTime > 1000 * 60 * 60 * 24 * 14) {
                    _.toggleLoginBtn();
                    return false;
                }
                return user;
            }
            this.showTips = function (o) {
                if (!o.text) {
                    throw 'text is not defined!';
                }
                let eventClass = o.eventClass || '';
                let tip_type = o.type || 'info';
                let index = 'tips_' + tips_count;
                let duration = o.duration || 3000;
                let pss = `<div class="pss" style="animation-duration:${duration}ms;"></div>`;
                if (tip_type == 'standby') {
                    duration = 60000;
                    pss = `<div class="pss" style="animation-duration:600ms;"></div>`;
                }
                let st1 = setTimeout(function () {
                    $('.tips').append(`<div class="mt tp ${index} ${tip_type} ${eventClass}">${o.text}${pss}</div>`);
                    let st2 = setTimeout(function () {
                        let eventObj = '';
                        if (eventClass && $('.' + eventClass).length) {
                            eventObj = $('.' + eventClass)
                        } else {
                            eventObj = $('.tp.' + index)
                        }
                        _.st2_fun(eventObj);
                    }, duration);
                }, 10);
                tips_count++;
            };
            this.st2_fun = function (obj, delay) {
                if (!delay) {
                    delay = 0;
                }
                let st = setTimeout(function () {
                    obj.addClass('r');
                    let st3 = setTimeout(function () {
                        obj.remove();
                    }, 800);
                }, delay);
            }
            this.getQueryParams = function (qs) {
                qs = qs.split('+').join(' ');
                let params = {},
                    tokens,
                    re = /[?&]?([^=]+)=([^&]*)/g;

                while (tokens = re.exec(qs)) {
                    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
                }
                return params;
            }
        }
    }
    app = new app();
    app.init();
})(document, window, jQuery)