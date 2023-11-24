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
    _.handleVideoAutoPlay()

    window.addEventListener('scroll', function(){
      _.handleVideoAutoPlay()
    })
  },
  components: {
    'app-audio': appAudio,
    'app-audio-diff': appAudioDiff,
    'video-view': videoView,
    'reactions': reactions,
    'v-comment': comment
  },
  methods: {
    handleVideoAutoPlay(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      document.querySelectorAll('.page-content video').forEach((el, index) => {
        let aboutToShow = el.offsetTop - scrollTop - windowHeight

        if(aboutToShow < -50 && el.paused && el.getAttribute('muted')){
          el.play()
        }

        if(aboutToShow < -50 && el.paused && !el.getAttribute('muted')){
          el.setAttribute('preload', 'auto')
        }
      })
    },
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

