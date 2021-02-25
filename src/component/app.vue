<template>
  <div class="app-wrap" :style="{ opacity: app_div.opacity }">
    <header>
      <div class="logo">
        <a href="#/" title="Click here to navigate homepage" id="header">
          <div class="img">
            <img src="/assets/img/logo-black.png" alt="logo" class="dark" />
            <img src="/assets/img/logo.png" alt="logo" class="light" />
          </div>
        </a>
      </div>
      <div class="slogan" ref="slogan">
        <span v-for="(item, i) in text_arr" :key="i" class="text-fadein-item" :style="{ 'animation-delay': getRandomInt(0, 500) + 'ms' }">{{ item }}</span>
      </div>
      <div class="page-small-menu" v-if="page_small">
        <ul>
          <li v-for="(item, i) in blog_page_list" :key="i">
            <a :href="'#/page/' + item.hash_url" v-html="item.name"></a>
          </li>
          <li>
            <a href="/atom.xml" target="_blank">RSS</a>
          </li>
        </ul>
      </div>
    </header>
    <div class="page-wrap">
      <section class="pages" aria-label="main" style="padding-top: 20px;">
        <div class="page" v-show="showing_page == 'index'">
          <div class="wrap">
            <section class="list">
              <div class="section_title" title="Below is the blog list">POSTS</div>
              <div class="fake_list" v-if="showing_fake_list">
                <div v-for="i in 10" class="li" :key="i">
                  <div class="title">
                    <span v-for="j in getRandomInt(2, 5)" :key="j" :style="{ width: getRandomInt(40, 80) + 'px', 'animation-duration': getRandomInt(1000, 3000) + 'ms' }"></span>
                  </div>
                  <div class="date">
                    <span></span>
                  </div>
                  <div class="sum">
                    <span v-for="j in getRandomInt(5, 10)" :key="j" :style="{ width: getRandomInt(50, 100) + 'px', 'animation-duration': getRandomInt(1000, 3000) + 'ms' }"></span>
                  </div>
                  <div class="tags">
                    <span v-for="j in getRandomInt(1, 4)" :key="j" :style="{ width: getRandomInt(60, 100) + 'px', 'animation-duration': getRandomInt(1000, 3000) + 'ms' }"></span>
                  </div>
                </div>
              </div>
              <div class="index_post_list" v-else>
                <ul>
                  <li v-for="(item, i) in blog_post_list" :key="i">
                    <a :href="'#/post/' + item.hash_url">
                      <div class="title" title="This is blog title">{{ item.name }}<span class="deprecated" v-if="item.deprecated">DEPRECATED</span></div>
                      <div class="date" v-html="item.date" title="This is blog release date"></div>
                      <div class="sum" title="This is blog summary">{{ item.summary }}</div>
                      <div class="tag" title="These are blog tags">
                        <span v-for="(tag, j) in item.tags" v-html="tag" :key="j"></span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </section>
            <section class="friends">
              <div class="section_title" title="Below are my friends links">FRIENDS</div>
              <div class="index_friends_list">
                <ul>
                  <li v-for="(item, i) in blog_friends_list" :key="i">
                    <a :href="item.url" target="_blank" rel="friend colleague">
                      <div class="title">{{ item.name }}</div>
                    </a>
                    <span>- {{ item.slogan }}</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
        <div class="page" data-param="post" v-show="showing_page == 'post' || showing_page == 'page'">
          <h2 class="page-header" v-html="current_page.title"></h2>
          <span class="page-deprecated" v-if="current_page.deprecated"> This article might contains outdated or misleading contents due to it is tagged as "Deprecated" by its author. </span>
          <div class="page-date" v-if="showing_page == 'post'">
            <span>👨‍💻{{ current_page.date }}</span>
            <span v-if="current_page.modify != ''" class="modify"> <br />✍{{ current_page.modify }} </span>
          </div>
          <div class="fake_post" v-show="show_fake_post">
            <div class="para" v-for="i in getRandomInt(5, 8)"  :key="i">
              <p>
                <span v-for="i in getRandomInt(10, 20)" :key="i" :style="{ width: getRandomInt(50, 300) + 'px', 'animation-duration': getRandomInt(1000, 3000) + 'ms' }" :data-dark-level="getRandomInt(1, 5)"></span>
              </p>
            </div>
          </div>
          <div class="page-content"></div>
          <div class="page-original">
            <a class="license" rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width: 0" src="/assets/img/cc.png"/></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
          </div>
        </div>
      </section>
      <section class="aside" v-if="!page_small" aria-label="aside">
        <ul>
          <li v-for="(item, i) in blog_page_list" :key="i">
            <a :href="'#/page/' + item.hash_url" v-html="item.icon + ' ' + item.name" class="dontread" :title="item.name"></a>
          </li>
          <li>
            <a href="/atom.xml" title="RSS feeds" class="dontread" target="_blank">🚩 RSS</a>
          </li>
        </ul>
      </section>
    </div>
    <footer>
      © <span class="copy_right_year">2018 - 2021</span><a href="/" class="footer-link">{{ blog_title }}</a
      >code with ❤
    </footer>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.js'
import axios from 'axios'
import base from '../js/base'
import hljs from 'highlight.js'
import { Router } from 'director/build/director'
import appAudio from './appAudio.vue'
import appAudioDiff from './appAudioDiff.vue'
const __ASSET = '/assets/'

export default {
  data: function() {
    return {
      getRandomInt: base.getRandomInt,
      blog_title: "Jacky's blog",
      blog_post_list: [],
      blog_page_list: [],
      blog_friends_list: [],
      showing_page: '',
      app_div: {
        opacity: 0
      },
      show_fake_post: false,
      showing_fake_list: true,
      current_page: {
        title: '',
        original: false,
        date: '',
        modify: '',
        deprecated: false
      },
      current_page_content: '',
      page_small: false,
      newVue: null,
      blog_slogan: 'Front-end developer / Music producer',
      text_arr: ''
    }
  },
  mounted: function() {
    let _ = this
    _.changeBlogTitle()
    _.app_div.opacity = 1
    axios
      .get(__ASSET + 'data.json')
      .then(function(res) {
        _.renderList(res)
      })
      .catch(function(error) {
        console.log(error)
        alert('获取博客列表失败，请刷新页面重试')
      })
    _.resizeFunc()
    document.querySelector('body').classList.add('trans')
    window.onresize = function() {
      _.resizeFunc()
    }
    hljs.configure({
      tabReplace: '  '
    })
  },
  methods: {
    doNothing: function() {},
    clearCurrentPage: function() {
      let _ = this
      _.current_page = {
        title: '',
        original: false,
        date: '',
        modify: ''
      }
      _.current_page_content = null
    },
    updateCurrrentPage: function(view, id) {
      let _ = this
      _.showing_page = view
      window.scrollTo(0, 0)
      _.newVue = null
      _.current_page_content = null
      let post_index = -1
      let list_arr = ''
      if (view == 'index') {
        _.clearCurrentPage()
        _.changeBlogTitle()
        return false
      }
      if (view == 'post') {
        list_arr = _.blog_post_list
      }
      if (view == 'page') {
        list_arr = _.blog_page_list
      }
      for (let i = 0; i < list_arr.length; i++) {
        let post_ele = list_arr[i]
        if (id == post_ele.hash_url) {
          post_index = i
          break
        }
      }
      if (post_index >= 0) {
        _.current_page.title = list_arr[post_index].name
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
      }
      let hash_url
      if (id) {
        let hash_url_arr = id.split('-')
        if (!hash_url_arr[1]) {
          hash_url = __ASSET + hash_url_arr[0]
        } else {
          let alter_folder = view
          if (view == 'post') alter_folder = 'posts'
          hash_url = __ASSET + alter_folder + '/' + hash_url_arr[0] + '/' + hash_url_arr[1]
        }
      }
      axios({
        method: 'get',
        url: hash_url,
        headers: {
          'Content-Type': 'text/html'
        }
      })
        .then(function(res) {
          _.current_page_content = res.data
          if (post_index >= 0) {
            _.changeBlogTitle(_.current_page.title + " - Jacky's blog")
          }
          _.show_fake_post = false
          _.$nextTick(function() {
            _.handleImgClick()
            _.handleLinkClick()
            _.newVueInstance()
            window.scrollTo(0, 0)
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    newVueInstance: function() {
      let _this = this
      _this.newVue = new Vue({
        el: '.page-content',
        mounted: function() {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block)
          })
        },
        components: {
          'app-audio': appAudio,
          'app-audio-diff': appAudioDiff
        }
      })
    },
    handleImgClick: function() {
      var _ = this
      let fn = function() {
        let parent = document.querySelector('.page-content')
        let img_arr = parent ? parent.querySelectorAll('img') : null
        if (img_arr) {
          img_arr.forEach((img) => {
            img.addEventListener('click', function() {
              let src = this.getAttribute('src')
              window.open(window.location.origin + src)
            })
          })
        }
      }
      Vue.nextTick(fn)
    },
    handleLinkClick: function() {
      var _ = this
      let fn = function() {
        let parent = document.querySelector('.page-content')
        let a_arr = parent ? parent.querySelectorAll('a') : null
        if (a_arr) {
          a_arr.forEach((a) => {
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
          })
        }
      }
      Vue.nextTick(fn)
    },
    initRouter: function() {
      let _ = this
      let home = function() {
        _.showing_page = 'index'
        _.updateCurrrentPage('index')
      }
      let post = function(id) {
        _.show_fake_post = true
        _.updateCurrrentPage('post', id)
      }
      let page = function(id) {
        _.show_fake_post = true
        _.updateCurrrentPage('page', id)
      }
      let test = function() {
        _.updateCurrrentPage('test')
      }
      let routes = {
        '/': home,
        '/post/:id': post,
        '/page/:id': page,
        '/test': test
      }

      let router = Router(routes)
      router.init('/')
    },
    renderList: function(res) {
      var _ = this
      if (res.status != 200) {
        alert('获取博客列表失败，请刷新页面重试')
        console.log(res)
        return false
      }
      _.blog_post_list = res.data.articles
      _.blog_page_list = res.data.pages
      _.blog_friends_list = res.data.links
      _.initRouter()
      setTimeout(function() {
        _.showing_fake_list = false
        _.text_arr = _.blog_slogan.split('')
      }, 100)
    },
    changeBlogTitle: function(t) {
      let _ = this
      if (!t) {
        document.querySelector('title').innerHTML = _.blog_title
        return false
      }
      document.querySelector('title').innerHTML = t
    },
    system_lighting: function() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true
      } else {
        return false
      }
    },
    resizeFunc: function() {
      let _this = this
      if (window.innerWidth < 686) {
        _this.page_small = true
      } else {
        _this.page_small = false
      }
    }
  },
  watch: {
    current_page_content: function(e) {
      let page_content = document.querySelector('.page-content')
      page_content.innerHTML = e
    },
    show_fake_post: function(e) {
      let page_content = document.querySelector('.page-content')
      if (!e) {
        page_content.classList.add('on')
      } else {
        page_content.classList.remove('on')
      }
    }
  }
}
</script>
