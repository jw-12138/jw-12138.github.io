import appAudio from './components/appAudio.js'
import appAudioDiff from './components/appAudioDiff.js'
import videoView from './components/videoView.js'
import reactions from './components/reactions.js'
import comment from './components/comment.js'

new Vue({
  el: '#app',
  data: function () {
    return {
      page_small: false
    }
  },
  mounted: function () {
    let _ = this
    _.handleImgClick()
  },
  components: {
    'app-audio': appAudio,
    'app-audio-diff': appAudioDiff,
    'video-view': videoView,
    'reactions': reactions,
    'v-comment': comment
  },
  methods: {
    handleImgClick: function () {
      let _ = this
      let fn = function () {
        document.querySelectorAll('.page-content img').forEach(el => {
          el.addEventListener('click', function () {
            window.open(el.src)
          })
        })
      }
      Vue.nextTick(fn)
    }
  },
  watch: {}
})

