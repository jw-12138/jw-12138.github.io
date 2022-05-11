import {sec2time, getTimeStamp, getRandomInt} from "../utils";

export default {
  props: {
    src: {
      default: ''
    },
    label: {
      default: ''
    },
    hasloop: {
      default: false
    }
  },
  template: `<div class="app-audio-wrap">
  <audio :src="src" ref="audio_ele" preload="metadata"></audio>
  <div class="name">
    {{ label }}
  </div>
  <div class="time" title="This is the timing panel">
    <span class="b" :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em aria-hidden="true">/</em> <span :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
  </div>
  <div class="control" title="This is the control panel">
    <div class="btn-grp">
      <button class="btn" @click="handleClick" :title="!playing ? 'Paused, click to start playing audio' : 'started, click to pause audio'">
        <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M10.8 15.9l4.67-3.5c.27-.2.27-.6 0-.8L10.8 8.1c-.33-.25-.8-.01-.8.4v7c0 .41.47.65.8.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
        <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M10 16c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1zm2-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-4c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z" /></svg>
      </button>
      <button class="btn" @click="stopAudio" title="click to stop playing audio">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
          <g>
            <rect fill="none" height="24" width="24" />
            <rect fill="none" height="24" width="24" />
          </g>
          <g><path d="M9,16h6c0.55,0,1-0.45,1-1V9c0-0.55-0.45-1-1-1H9C8.45,8,8,8.45,8,9v6 C8,15.55,8.45,16,9,16z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z" fill-rule="evenodd" /></g>
        </svg>
      </button>
      <button v-if="hasloop" class="btn" :title="!looping ? 'Put audio on loop' : 'Currently on loop, click again to disable'" @click="toggle_loop" :class="{ on: looping }">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z" /></svg>
      </button>
    </div>
  </div>
  <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @change="onRangeChange" @input="onRangeInput" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" :style="{ 'background-image': 'url(' + wave_img_src + ')' }" />
</div>`,
  computed: {},
  mounted: function () {
    let _this = this
    let a = this.$refs.audio_ele
    a.addEventListener('loadedmetadata', function () {
      _this.canplayFun(a)
    })
    _this.instance_id = getTimeStamp()
    document.addEventListener('mouseup', function () {
      _this.range_count = 0
    })
    document.addEventListener('touchend', function () {
      _this.range_count = 0
    })
  },
  methods: {
    sec2time: sec2time,
    getTimeStamp: getTimeStamp,
    getRandomInt: getRandomInt,
    canplayFun: function (a) {
      let _this = this
      _this.audio = a
      if(_this.audio.duration === Infinity){
        _this.audio.currentTime = 1e101
      }
  
      _this.audio.currentTime = 0
      
      _this.duration = _this.audio.duration
      _this.percent = _this.calcPercentage()
      _this.hasWave()
      _this.audio.ontimeupdate = function () {
        if (!_this.adjust_progress_ready && _this.range_count === 0) {
          _this.percent = _this.calcPercentage()
          _this.currentTime = _this.audio.currentTime
        }
      }
      _this.audio.onended = function () {
        _this.percent = 0
        _this.audio.currentTime = 0
        _this.currentTime = 0
        if (_this.looping) {
          _this.audio.play()
          return false
        }
        _this.playing = false
      }

      _this.audio.onpause = function () {
        _this.playing = false
      }

      _this.audio.onplay = function () {
        _this.playing = true
      }
    },
    hasWave: function () {
      let _this = this
      let url_arr = _this.src.split('.')
      let url = url_arr[0] + '.png'
      axios({
        method: 'get',
        url: url
      })
        .then(function (res) {
          if (res.status === 200) {
            _this.wave_img = true
            _this.wave_img_src = url
          }
        })
        .catch(function (error) {
        
        })
    },
    handleClick: function (e) {
      e.preventDefault()
      let _this = this
      _this.playing = !_this.playing
    },
    calcPercentage: function () {
      let _this = this
      let ct = _this.audio.currentTime
      let du = _this.audio.duration
      return (ct / du) * 100
    },
    stopAudio: function (e) {
      e.preventDefault()
      let _this = this
      _this.audio.currentTime = 0
      _this.currentTime = _this.audio.currentTime
      _this.playing = false
      _this.looping = false
    },
    toggle_loop: function (e) {
      e.preventDefault()
      this.looping = !this.looping
    },
    onRangeChange: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.adjust_progress_ready = false
      _this.percent = range_input.value
      _this.audio.currentTime = (_this.percent / 100) * _this.audio.duration
      _this.currentTime = _this.audio.currentTime
      _this.range_count = 0
    },
    onRangeInput: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.currentTime = (_this.percent / 100) * _this.audio.duration
      _this.adjust_progress_ready = false
      _this.range_count++
    },
    rangeChangeDown: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.audio.currentTime = (_this.percent / 100) * _this.audio.duration
      _this.currentTime = _this.audio.currentTime
      _this.adjust_progress_ready = true
    }
  },
  data: function () {
    return {
      playing: false,
      percent: 0,
      audio: null,
      adjust_progress_ready: false,
      duration: 0,
      currentTime: 0,
      wave_img: false,
      wave_img_src: '',
      timeOffset: 0.25,
      instance_id: null,
      looping: false,
      range_count: 0
    }
  },
  watch: {
    playing: function (e) {
      let _this = this
      if (e) {
        _this.audio.play()
      } else {
        _this.audio.pause()
      }
    }
  }
}
