export default {
  computed: {
    authURL: function () {
      return `${this.auth_api}?client_id=${this.client_id}&redirect_uri=https://api.jw1.dev/gho/callback?r=${location.href}&scope=public_repo`
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

    _.getComments()
  },
  data: function () {
    return {
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
      client_id: '550c180c03784f339404',
      auth_api: 'https://github.com/login/oauth/authorize'
    }
  },
  methods: {
    quit() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
      this.logged_in = false
      this.user = {}
      this.sending_comment = false
    },
    parseMarkdown(md) {
      return marked.parse(
        md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
      )
    },
    getUser() {
      let _ = this
      this.ax
        .get('/user')
        .then((res) => {
          if (res.status === 200) {
            _.logged_in = true
            _.user = res.data
          }
        })
        .catch((err) => {
          console.log(err)
          if (err.response.status === 401) {
            _.quit()
          }
        })
    },
    deleteComment(id) {
      let _ = this
      let c = confirm('确定要删除这条评论吗？😯')
      if (!c) {
        return
      }
      _.getDeleteID = id
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
        })
        .then((res) => {
          _.getComments(_.issue_number)
          _.write_content = ''
          _.sending_comment = false
        })
        .catch((err) => {
          alert('评论系统遇到点问题，刷新一下页面试试？😅')
          _.sending_comment = false
        })
    },
    getComments(issueNumber) {
      let _ = this
      if (!_.issue_number) {
        return
      }

      _.issue_number = _.issue_number ? _.issue_number : issueNumber
      axios
        .get(
          `https://api.jw1.dev/gha/forward?action=get_issue_comments&number=${_.issue_number}`,
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
    }
  },
  watch: {
    write_content(val) {
      this.preview_content = filterXSS(
        marked.parse(val.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''))
      )
    }
  },
  template: '#temp_comments'
}
