import {sec2time, getTimeStamp, getRandomInt} from '../utils'

export default {
  props: {
    on: {
      default: {},
      type: 'object'
    },
    off: {
      default: {},
      type: 'object'
    }
  },
  template: `
  <div class="app-audio-wrap" :class="{ playing: playing }">
  <audio :src="on.src" preload="metadata" ref="audio_1" :loop="looping"></audio>
  <audio :src="off.src" preload="metadata" ref="audio_2" :loop="looping"></audio>
  <div class="name">
    <span class="icon" aria-hidden="true">
      <span class="material-symbols-rounded" style="position: relative; top: 2px;">
      music_note
      </span>
    </span>
    <span>
      {{ playing_index === 0 ? activeText : inactiveText }}
    </span>
  </div>
  <div class="time" title="This is the timing panel">
    <span class="b" :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em aria-hidden="true">/</em> <span :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
  </div>
  <div class="control" title="This is the control panel">
    <div class="btn-grp">
      <button class="btn" @click="playFun" title="Play and Pause">
        <i class="iconfont" v-if="!playing">&#xe66b;</i>
        <i class="iconfont" v-if="playing">&#xe66c;</i>
      </button>
      <button class="btn" @click="stopAudio" title="Stop">
        <i class="iconfont">&#xe661;</i>
      </button>
      <button class="btn" @click="switchSource" title="Switch" :class="{ on: playing_index == 1, spin: playing_index == 1 }">
        <i class="iconfont">&#xe66d;</i>
      </button>
      <button class="btn" title="Loop" @click="toggle_loop" :class="{ on: looping }">
        <i class="iconfont">&#xe66e;</i>
      </button>
    </div>
  </div>
  <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @input="onRangeInput" @change="onRangeChange" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" :style="{ 'background-image': 'url(' + wave_img_src + ')' }" />
</div>
  `,
  computed: {},
  mounted: function () {
    let _this = this
    if (!_this.on) {
      return false
    }
    if (!_this.off) {
      return false
    }
    _this.instance_id = '_' + getTimeStamp()
    
    _this.audio_1 = _this.$refs.audio_1
    _this.audio_2 = _this.$refs.audio_2
    _this.audio_2.volume = 0
    let dataPath = _this.on.src.replace('.mp3', '.json')
    axios.get(dataPath).then(res => {
      _this.duration = res.data.format.duration
      _this.canplayFun()
      _this.audio_1.addEventListener('pause', function () {
        _this.playing = false
      })
      _this.audio_1.addEventListener('play', function () {
        _this.playing = true
      })
      document.addEventListener('mouseup', function () {
        _this.range_count = 0
      })
      document.addEventListener('touchend', function () {
        _this.range_count = 0
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    sec2time: sec2time,
    getTimeStamp: getTimeStamp,
    getRandomInt: getRandomInt,
    toggle_loop: function (e) {
      e.preventDefault()
      this.looping = !this.looping
    },
    calcPercentage: function () {
      let _this = this
      let ct = _this.audio_1.currentTime
      let du = _this.duration
      return (ct / du) * 100
    },
    canplayFun: function () {
      let _this = this
      _this.percent = _this.calcPercentage()
      _this.audio_1.ontimeupdate = function () {
        if (!_this.adjust_progress_ready && _this.range_count === 0) {
          _this.percent = _this.calcPercentage()
          _this.currentTime = _this.audio_1.currentTime
        }
      }
      _this.audio_1.onended = function () {
        _this.percent = 0
        _this.audio_1.currentTime = 0
        _this.audio_2.currentTime = 0
        _this.currentTime = 0
      }
      
      _this.audio_1.onpause = function () {
        _this.playing = false
      }
      
      _this.audio_1.onplay = function () {
        _this.playing = true
      }
    },
    playFun: function (e) {
      e.preventDefault()
      let _this = this
      if (_this.playing) {
        _this.audio_1.pause()
        _this.audio_2.pause()
      } else {
        _this.audio_1.play()
        _this.audio_2.play()
      }
      
      _this.playing = !_this.playing
    },
    stopAudio: function (e) {
      e.preventDefault()
      let _this = this
      _this.audio_1.pause()
      _this.audio_2.pause()
      _this.audio_1.currentTime = 0
      _this.audio_2.currentTime = 0
      _this.currentTime = _this.audio_1.currentTime
      _this.percent = 0
      _this.adjust_progress_ready = false
      _this.playing = false
      _this.looping = false
      _this.range_count = 0
    },
    onRangeInput: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.currentTime = (_this.percent / 100) * _this.duration
      _this.adjust_progress_ready = false
      _this.range_count++
    },
    switchSource: function (spec) {
      let _this = this
      let _off = function () {
        if (_this.playing_index === 1) {
          return false
        }
        _this.playing_index = 1
        _this.audio_1.volume = 0
        _this.audio_2.volume = 1
      }
      let _on = function () {
        if (_this.playing_index === 0) {
          return false
        }
        _this.playing_index = 0
        _this.audio_1.volume = 1
        _this.audio_2.volume = 0
      }
      
      if (typeof spec == 'string' && spec !== '') {
        if (spec === 'on') {
          _on()
        } else {
          _off()
        }
        return false
      }
      
      if (_this.playing_index === 0) {
        _off()
      } else {
        _on()
      }
    },
    onRangeChange: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.audio_1.currentTime = (_this.percent / 100) * _this.duration
      _this.audio_2.currentTime = (_this.percent / 100) * _this.duration
      _this.currentTime = (_this.percent / 100) * _this.duration
      console.log(_this.currentTime)
      _this.adjust_progress_ready = false
      _this.range_count = 0
    },
    rangeChangeDown: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.currentTime = _this.audio_1.currentTime
      _this.adjust_progress_ready = true
    }
  },
  data: function () {
    return {
      audio_ctx: null,
      playing: false,
      playing_index: 0,
      duration: 0,
      percent: 0,
      audio_1: null,
      audio_2: null,
      adjust_progress_ready: false,
      currentTime: 0,
      looping: false,
      canplay_count: 0,
      activeText: this.on.text,
      inactiveText: this.off.text,
      wave_img: false,
      wave_img_src: '',
      instance_id: null,
      range_count: 0,
      fade_time: 0.1
    }
  },
  watch: {}
}
