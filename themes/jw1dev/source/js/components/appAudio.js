import {sec2time, getTimeStamp, getRandomInt} from '../utils'

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
    <span class="icon" aria-hidden="true">
      <i class="iconfont">
      &#xe7c1;
      </i>
    </span>
    {{ label }}
  </div>
  <div class="time" title="This is the timing panel">
    <span class="b" :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em aria-hidden="true">/</em> <span :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
  </div>
  <div class="control" title="This is the control panel">
    <div class="btn-grp">
      <button class="btn" @click="handleClick" title="Play and Pause">
        <i class="iconfont" v-if="!playing">&#xe66b;</i>
        <i class="iconfont" v-if="playing">&#xe66c;</i>
      </button>
      <button class="btn" @click="stopAudio" title="Stop">
        <i class="iconfont">&#xe661;</i>
      </button>
      <button v-if="hasloop" class="btn" title="Loop" @click="toggle_loop" :class="{ on: looping }">
        <i class="iconfont">&#xe66e;</i>
      </button>
    </div>
  </div>
  <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @change="onRangeChange" @input="onRangeInput" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" />
</div>`,
  mounted: function () {
    let _this = this
    let a = this.$refs.audio_ele
    let dataPath = _this.src.replace('.mp3', '.json')
    axios.get(dataPath).then(res => {
      _this.duration = res.data.format.duration
      _this.canplayFun(a)
      _this.instance_id = getTimeStamp()
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
    canplayFun: function (a) {
      let _this = this
      _this.audio = a
      _this.percent = _this.calcPercentage()
      let interval = 0
      a.ontimeupdate = function () {
        clearInterval(interval)
        if (!_this.adjust_progress_ready && _this.range_count === 0) {
          _this.percent = _this.calcPercentage()
          _this.currentTime = _this.audio.currentTime
          let recurring = 0
          interval = setInterval(function () {
            if(recurring >= 25){
              clearInterval(interval)
            }
            _this.currentTime = _this.audio.currentTime
            recurring++
          }, 10)
        }
      }
      _this.audio.onended = function () {
        _this.percent = 0
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
    handleClick: function (e) {
      e.preventDefault()
      let _this = this
      _this.playing = !_this.playing
    },
    calcPercentage: function () {
      let _this = this
      let ct = _this.audio.currentTime
      let du = _this.duration
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
      _this.percent = parseInt(range_input.value)
      _this.audio.currentTime = (_this.percent / 100) * _this.duration
      _this.currentTime = _this.audio.currentTime
      _this.range_count = 0
    },
    onRangeInput: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.currentTime = (_this.percent / 100) * _this.duration
      _this.adjust_progress_ready = false
      _this.range_count++
    },
    rangeChangeDown: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
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
      range_count: 0,
      clickPlayCount: 0
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
