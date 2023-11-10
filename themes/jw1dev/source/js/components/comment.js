export default {
  computed: {
    authURL: function () {
      return `${this.auth_api}?client_id=${this.client_id}&redirect_uri=https://blog-api.jw1dev.workers.dev/github/callback?r=${location.href}&scope=public_repo`
    },
    issue_number: function () {
      let input = document.querySelector('input[name=ISSUE_NUMBER]')
      if (input) {
        return parseInt(input.value)
      } else {
        return undefined
      }
    }
  },
  mounted() {
    let _ = this
    let params = new URLSearchParams(document.location.search)
    let token = params.get('access_token')
    let type = params.get('token_type')
    if (token && type) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token_type', type)
      localStorage.setItem('token_timestamp', new Date())
      location.href =
        location.protocol +
        '//' +
        location.host +
        location.pathname +
        '#comments'

      return
    }

    let l_token = localStorage.getItem('access_token')

    if (l_token) {
      _.ax = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + l_token
        }
      })

      _.getUser()
    }

    window.addEventListener('click', function () {
      if (_.mouseIsInsideWindow === false) {
        _.userActionWindow = false
      }
    })

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _.userActionWindow === true) {
        _.userActionWindow = false
      }
    })

    _.getComments()
  },
  data: function () {
    return {
      userActionWindow: false,
      gettingComments: false,
      gettingUser: false,
      deletingComment: false,
      ax: null,
      commentsLoading: true,
      getDeleteID: -1,
      isWritingComment: false,
      comment_page: 1,
      per_page: 50,
      user: {},
      owner: 'jw-12138',
      repo: 'jw-12138.github.io',
      comments: [],
      issue: {},
      tab_active: 0,
      preview_content: '',
      sending_comment: false,
      write_content: '',
      logged_in: false,
      mouseIsInsideWindow: false,
      client_id: '550c180c03784f339404',
      auth_api: 'https://github.com/login/oauth/authorize'
    }
  },
  methods: {
    quit(noConfirm) {
      if (!noConfirm) {
        let c = confirm('确定要退出登录吗？😯')
        if (!c) {
          return false
        }
      }

      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
      this.logged_in = false
      this.user = {}
      this.sending_comment = false
      this.userActionWindow = false
    },
    parseMarkdown(md) {
      return marked.parse(
        md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
      )
    },
    getUser() {
      let _ = this
      _.gettingUser = true
      this.ax.get('/user').then((res) => {
        if (res.status === 200) {
          _.logged_in = true
          _.user = res.data
        }
      }).catch((err) => {
        console.log(err)
        if (err.response.status === 401) {
          _.quit(true)
        }
      }).finally(() => {
        _.gettingUser = false
      })
    },
    deleteComment(id) {
      let _ = this
      let c = confirm('确定要删除这条评论吗？😯')
      if (!c) {
        return
      }
      _.getDeleteID = id
      _.deletingComment = true
      _.ax
        .delete(`/repos/${_.owner}/${_.repo}/issues/comments/${id}`)
        .then((res) => {
          if (res.status === 204) {
            _.getComments(_.issue_number)
          }
        })
        .catch((err) => {
          console.log('delete err: ' + err)
          _.getDeleteID = -1
          alert('没有删除成功，服务端好像出了点问题😅')
        })
        .finally(function () {
          _.deletingComment = false
        })
    },
    monitKeys(e) {
      if ((e.keyCode === 10 || e.keyCode === 13) && e.ctrlKey) {
        this.sendComment()
      }
    },
    mention(id) {
      this.write_content = `@${id} ` + this.write_content
      document.getElementById('comments_area').focus()
    },
    sendComment() {
      let _ = this
      if (!_.logged_in) {
        alert('请先登录哦 😅')
        return
      }
      if (_.sending_comment) {
        return
      }

      if (_.write_content === '') {
        alert('写点什么吧 😅')
        return
      }

      _.sending_comment = true

      if (_.issue_number === undefined) {
        alert('评论系统遇到点问题，刷新一下页面试试？😅')
        return
      }

      _.ax
        .post(`/repos/${_.owner}/${_.repo}/issues/${_.issue_number}/comments`, {
          body: _.write_content
        }).then((res) => {
        _.getComments(_.issue_number)
        _.write_content = ''
        _.sending_comment = false
      }).catch((err) => {
        alert('评论系统遇到点问题，刷新一下页面试试？😅')
        _.sending_comment = false
      })
    },
    goToGithubLogin() {
      if (this.logged_in) {
        return false
      }
      location.href = this.authURL
    },
    getComments(issueNumber) {
      let _ = this
      if (!_.issue_number) {
        return
      }

      _.gettingComments = true
      _.issue_number = _.issue_number ? _.issue_number : issueNumber
      axios
        .get(
          `https://blog-api-cf-worker.jw1.dev/github/forward?action=get_issue_comments&number=${_.issue_number}`,
          {}
        )
        .then((res) => {
          if (res.status === 200) {
            _.comments = res.data
          }
          _.commentsLoading = false
        })
        .catch((err) => {
          _.commentsLoading = false
        })
        .finally(() => {
          _.gettingComments = false
        })
    }
  },
  watch: {
    write_content(val) {
      this.preview_content = filterXSS(
        marked.parse(val.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''))
      )
    }
  },
  template: `
    <div class="comments-box" id="comments" v-if="issue_number">
      <div v-show="gettingUser" class="text-center text-xs py-2">
        正在读取用户信息...
      </div>
      <div class="text-center relative h-[32px]" v-show="!gettingUser">
        <div
          @mouseenter="mouseIsInsideWindow = true"
          @mouseleave="mouseIsInsideWindow = false"
          class="border-neutral-100 dark:border-neutral-700 border absolute w-[200px] px-2 py-2 rounded-[1rem] dark:bg-neutral-800 bg-white shadow left-1/2 bottom-[37px]"
          style="transform: translateX(-50%); animation: slideUp_offset .15s ease" v-if="userActionWindow">
          <button
            class="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 w-full rounded-[.5rem] flex items-center justify-center"
            @click="location.href = user.html_url"><i class="iconfont icon-github mr-2"></i> 我的 GitHub 主页
          </button>
          <button
            class="text-xs px-2 py-2 text-center dark:hover:bg-white/10 hover:bg-black/10 w-full rounded-[.5rem] flex items-center justify-center"
            @click="quit"><i class="iconfont icon-sign-out mr-2"></i> 退出登录
          </button>
        </div>
        <div
          @mouseenter="mouseIsInsideWindow = true"
          @mouseleave="mouseIsInsideWindow = false"
          class="user-window dark:bg-neutral-800 bg-neutral-100 h-[32px] items-center inline-block border-none relative z-10 rounded-full hover:shadow-xl transition-all">
          <button v-show="logged_in" class="flex h-[32px] items-center border-none cursor-pointer select-none rounded-full"
                  @click.stop="userActionWindow = !userActionWindow" @focus="mouseIsInsideWindow = true" @blur="mouseIsInsideWindow = false">
            <span class="w-[32px] h-[32px] overflow-hidden rounded-full">
              <img :src="user.avatar_url" alt="user avatar" class="w-full h-full">
            </span>
            <span class="text-xs pl-2 pr-2">
              {{ user.login }}
            </span>
            <span>
              <i class="iconfont icon-zhankai pr-2" style="font-size: 14px" v-show="!userActionWindow"></i>
              <i class="iconfont icon-close-bold pr-2" style="font-size: 14px" v-show="userActionWindow"></i>
            </span>
          </button>
          <div v-show="!logged_in">
            <button @click="goToGithubLogin" class="inline-block w-auto py-0 px-4 h-[32px] mb-0 bg-transparent text-xs">
              <i
                class="iconfont icon-github" style="font-size: 16px"></i> 使用GitHub登录以评论
            </button>
          </div>
        </div>
      </div>

      <div class="c-body relative">
        <div class="rounded-[16px] py-2">
          <button class="item rounded-[16px] py-2 px-4 text-xs" @click="tab_active = 0"
                  :class="{'dark:bg-neutral-800 bg-neutral-200 opacity-100': tab_active === 0}">Write
          </button>
          <button class="item rounded-[16px] py-2 px-4 text-xs" @click="tab_active = 1"
                  :class="{'dark:bg-neutral-800 bg-neutral-200 opacity-100': tab_active === 1}">Preview
          </button>
        </div>
        <div class="write-box relative" v-show="tab_active === 0" :class="{on: tab_active === 0}">
          <textarea name="" id="comments_area" v-model="write_content"
                    :placeholder="logged_in ? '提些问题或者打个招呼 🎈' : '评论前要先登录的哇 👆'"
                    :disabled="tab_active === 1 || !logged_in" @focus="isWritingComment = true"
                    @blur="isWritingComment = false" @keyup="monitKeys"></textarea>
        </div>
        <div v-show="tab_active === 1" :class="{on: tab_active === 1}" class="preview-box comment-content"
             v-html="preview_content === '' ? '没有可以预览的东西哇' : preview_content">

        </div>
        <div class="buttons text-center">
          <button
            class="btn send disabled:opacity-50 px-4 py-2 mt-4 mb-4 rounded-full bg-neutral-200 dark:bg-neutral-800"
            @click="sendComment" :disabled="sending_comment">🌹 发送评论
          </button>
        </div>
        <span class="key-stroke-info">Ctrl + Enter 也可以发送评论</span>
      </div>

      <div class="c-footer">
        <div class="text-center mb-4">
          <span v-show="commentsLoading">评论加载中 🫣</span>
          <span v-show="!commentsLoading" class="italic"> <span
            class="font-black text-[24px]">{{ comments.length }}</span> 条评论</span>
        </div>
        <div class="comments-list">
          <div class="item" v-for="(item, i) in comments" :id="item.id" :style="{
        opacity: getDeleteID === item.id ? '.5' : '1'
      }">
            <div class="datetime">
              {{ new Date(item.created_at).toLocaleString('zh-CN') }}
            </div>
            <div class="user">
              <span class="outer-box">
                <a :href="item.user.html_url" target="_blank" class="user-info">
                  <img :src="item.user.avatar_url" alt="用户头像"> <span>{{ item.user.login }} <span class="author-tag"
                                                                                                     v-if="item.author_association === 'OWNER'">作者</span> </span>
                </a>
                <span class="comment-actions" v-show="logged_in">
                  <button v-show="user.login === item.user.login" @click="deleteComment(item.id)"
                          class="h-[30px] leading-[28px] px-2 rounded-full bg-neutral-100 hover:bg-red-500 hover:text-white dark:bg-neutral-800 dark:text-white"><i
                    class="iconfont icon-ashbin relative top-[1px]" style="font-size: 14px"></i> 删除</button>
                  <button
                    class="h-[30px] leading-[28px] px-2 rounded-full bg-neutral-100 hover:bg-neutral-800 hover:text-white dark:bg-neutral-800 dark:text-white dark:hover:text-black dark:hover:bg-neutral-200"
                    v-show="user.login !== item.user.login" @click="mention(item.user.login)"
                    role="button">@</button>
                </span>
              </span>
            </div>
            <div class="comment-body comment-content" v-html="parseMarkdown(item.body)"></div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 2em">
          <a :href="issue.html_url" target="_blank" v-show="issue.comments > per_page">
            在 GitHub 上查看更多评论
          </a>
        </div>
      </div>
    </div>`
}
