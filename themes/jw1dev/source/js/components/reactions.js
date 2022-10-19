export default {
  mounted: function () {
    this.getThumbs()
  },
  methods: {
    upFunc: function () {
      let _ = this
      _.active_index = 0
      
      if (_.expanded) {
        return
      }
      
      setTimeout(function () {
        _.expanded = false
      }, 1200)
      
      axios.get(_.apiBase + '/thumbs/up?path=' + location.pathname).then(res => {
        if (res.data.status === 0) {
          _.up = res.data.count
        }
      }).catch(err => {
        console.log(err)
      })
      
      _.page_up_count++
      
      _.changeText()
      
      _.expanded = true
    },
    changeText: function () {
      let _ = this
      if (_.page_up_count >= 3) {
        _.info[0] = '爱您 🙌'
      }
      if (_.page_up_count >= 10) {
        _.info[0] = '真不用这样'
      }
      if (_.page_up_count >= 11) {
        _.info[0] = '谢谢！🥰'
      }
      if (_.page_up_count >= 20) {
        _.info[0] = '好吧，你要是想刷那就继续刷吧'
      }
      if (_.page_up_count >= 21) {
        _.info[0] = '谢谢！🥰'
      }
      if (_.page_up_count >= 25) {
        _.info[0] = '后面真的不会再变了'
      }
      if (_.page_up_count >= 26) {
        _.info[0] = '谢谢！🥰'
      }
      if (_.page_up_count >= 50) {
        _.info[0] = '佩服你的毅力！'
      }
      if (_.page_up_count >= 51) {
        _.info[0] = '谢谢！🥰'
      }
    },
    downFunc: function () {
      let _ = this
      _.active_index = 1
      
      if (_.expanded) {
        return
      }
      
      setTimeout(function () {
        _.expanded = false
      }, 2500)
      
      axios.get(_.apiBase + '/thumbs/down?path=' + location.pathname).then(res => {
        if (res.data.status === 0) {
          _.down = res.data.count
        }
      }).catch(err => {
        console.log(err)
      })
      
      _.expanded = true
    },
    getThumbs: function () {
      let _ = this
      axios.get(_.apiBase + '/thumbs/get?path=' + location.pathname).then(res => {
        if (res.data.status === 0) {
          _.up = res.data.data.up
          _.down = res.data.data.down
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  data: function () {
    return {
      apiBase: 'https://api.jw1.dev',
      active_index: 0,
      up: 0,
      page_up_count: 0,
      down: 0,
      expanded: false,
      info: ['谢谢！🥰', '我会努力的！🥹']
    }
  },
  template: `
<div class="reactions">
  <a href="javascript:;" role="button" class="item" @click="upFunc">👍 <em>{{ up }}</em></a>
  <a href="javascript:;" role="button" class="item" @click="downFunc">👎 <em>{{ down }}</em></a>
  <div class="info" :class="{expanded: expanded}">{{active_index === 0 ? info[0] : info[1]}}</div>
</div>
  `
}