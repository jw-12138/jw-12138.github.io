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
    hljs.configure({
      tabReplace: '  '
    })
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
    _.handleLinkClick()
    _.handleImgClick()
  },
  components: {
    'app-audio': appAudio,
    'app-audio-diff': appAudioDiff
  },
  methods: {
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