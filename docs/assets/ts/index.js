new Vue({
  el: '#app',
  data: function() {
    return {
      page_small: false
    }
  },
  mounted: function() {
    let _ = this
    _.resizeFunc()
    window.onresize = function() {
      _.resizeFunc()
    }
    _.handleLinkClick()
  },
  methods: {
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
    resizeFunc: function() {
      let _ = this
      if (window.innerWidth < 686) {
        _.page_small = true
      } else {
        _.page_small = false
      }
    }
  },
  watch: {
    
  }
})