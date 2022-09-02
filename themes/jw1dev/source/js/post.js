import appAudio from "./components/appAudio";
import appAudioDiff from "./components/appAudioDiff";
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
        let parent = document.querySelector('.page-content')
        let img_arr = parent ? parent.querySelectorAll('img') : null
        if (img_arr) {
          img_arr.forEach((img) => {
            img.addEventListener('click', function () {
              let src = this.getAttribute('src')
              window.open(window.location.origin + src)
            })
          })
        }
      }
      Vue.nextTick(fn)
    }
  },
  watch: {}
})

