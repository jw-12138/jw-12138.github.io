import appAudio from './components/appAudio'
import appAudioDiff from './components/appAudioDiff'
import videoView from './components/videoView.js'

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
    'video-view': videoView
  },
  methods: {
    handleImgClick: function () {
      let _ = this
      let fn = function () {
        $('.page-content img').on('click', function () {
          let src = $(this).attr('src')
          window.open(window.location.origin + src)
        })
      }
      Vue.nextTick(fn)
    }
  },
  watch: {}
})

