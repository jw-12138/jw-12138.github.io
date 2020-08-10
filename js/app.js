let app = new Vue({
    el: '#app',
    calculated: function () {

    },
    mounted: function () {
        let _ = this
        _.changeBlogTitle()
        _.app_div.opacity = 1
        axios.get('/data/data.json')
            .then(function (res) {
                _.renderList(res)
            })
            .catch(function (error) {
                console.log(error);
                alert('获取博客列表失败，请刷新页面重试');
            });
    },
    methods: {
        clearCurrentPage: function () {
            let _ = this
            _.current_page = {
                title: '',
                content: '',
                original: false,
                date: '',
                modify: ''
            }
        },
        updateCurrrentPage: function (view, id) {
            let _ = this
            _.showing_page = view
            window.scrollTo(0, 0)
            if (view == 'index') {
                _.clearCurrentPage()
                _.changeBlogTitle()
                return false
            }
            let hash_url_arr = id.split('-')
            let hash_url
            if (!hash_url_arr[1]) {
                hash_url = hash_url_arr[0]
            } else {
                hash_url = view + '/' + hash_url_arr[0] + '/' + hash_url_arr[1]
            }

            axios.get(hash_url)
                .then(function (res) {
                    let post_index = -1;
                    let list_arr = ''
                    if (view == 'post') {
                        list_arr = _.blog_post_list
                    } else {
                        list_arr = _.blog_page_list
                    }
                    for (let i = 0; i < list_arr.length; i++) {
                        let post_ele = list_arr[i];
                        if (id == post_ele.hash_url) {
                            post_index = i
                        }
                    }
                    _.current_page.title = list_arr[post_index].name
                    _.current_page.content = res.data
                    if (list_arr[post_index].original) {
                        _.current_page.original = list_arr[post_index].original
                    }
                    if (list_arr[post_index].date) {
                        _.current_page.date = list_arr[post_index].date
                    }
                    if (list_arr[post_index].last_mod) {
                        _.current_page.modify = list_arr[post_index].last_mod
                    }
                    if (list_arr[post_index].deprecated) {
                        _.current_page.deprecated = list_arr[post_index].deprecated
                    }
                    _.updateHighLight()
                    _.changeBlogTitle(_.current_page.title + ' - 一个球的博客')
                    _.initGitTalk()
                    _.$forceUpdate()
                    _.show_fake_post = false
                    _.handleImgClick()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleImgClick: function () {
            var _ = this;
            let fn = function () {
                let parent = document.querySelector('.page-content')
                let img_arr = parent.querySelectorAll('img')
                if(img_arr){
                    img_arr.forEach(img => {
                        img.addEventListener('click', function () {
                            let src = this.getAttribute('src')
                            window.open(window.location.origin + src)
                        })
                    });
                }
            }
            Vue.nextTick(fn);
        },
        initGitTalk: function () {
            const gitalk = new Gitalk({
                clientID: '5141110640537474b2ff',
                clientSecret: 'cbe155f5b08e9c7d93378f7bfa97a6d063663d6d',
                repo: 'jw-12138.github.io', // The repository of store comments,
                owner: 'jw-12138',
                admin: ['jw-12138'],
                id: location.hash, // Ensure uniqueness and length less than 50
                distractionFreeMode: false // Facebook-like distraction free mode
            })

            gitalk.render('gitalk-container')
        },
        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        },
        updateHighLight: function () {
            let code_arr = document.querySelectorAll('pre code')
            code_arr.forEach(ele => {
                hljs.highlightBlock(ele)
            });
        },
        initRouter: function () {
            let _ = this
            let home = function () {
                _.showing_page = 'index'
                update_ga()
                _.updateCurrrentPage('index')
            }
            let post = function (id) {
                update_ga()
                _.show_fake_post = true
                _.updateCurrrentPage('post', id)
            }
            let page = function (id) {
                update_ga()
                _.show_fake_post = true
                _.updateCurrrentPage('page', id)
            }
            let update_ga = function () {
                let pagename = window.location.pathname
                gtag('config', 'GA_MEASUREMENT_ID', {
                    'page_path': pagename
                });
            }
            let routes = {
                '/': home,
                '/post/:id': post,
                '/page/:id': page
            }

            let router = Router(routes);
            router.init('/');
        },
        renderList: function (res) {
            var _ = this
            if (res.status != 200) {
                alert('获取博客列表失败，请刷新页面重试');
                console.log(res);
                return false
            }
            _.blog_post_list = res.data.articles
            _.blog_page_list = res.data.pages
            _.blog_friends_list = res.data.links
            _.initRouter()
            setTimeout(function(){
                _.showing_fake_list = false;
            },200);
        },
        changeBlogTitle: function (t) {
            let _ = this
            if (!t) {
                document.querySelector('title').innerHTML = _.blog_title
                return false
            }
            document.querySelector('title').innerHTML = t
        }
    },
    data: {
        blog_title: '一个球的博客',
        blog_post_list: [],
        blog_page_list: [],
        blog_friends_list: [],
        showing_page: '',
        app_div: {
            opacity: 0
        },
        init_button_show: true,
        show_fake_post: false,
        showing_fake_list: true,
        current_page: {
            title: '',
            content: '',
            original: false,
            date: '',
            modify: '',
            deprecated: false
        },
        menu_open: false,
        menu_visible: false
    },
    watch: {

    }
})