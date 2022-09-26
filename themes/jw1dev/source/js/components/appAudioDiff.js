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
      <i class="iconfont">
      &#xe7c1;
      </i>
    </span>
      <span>
      {{ playing_index === 0 ? activeText : inactiveText }}
    </span>
    </div>
    <div class="time" title="This is the timing panel">
      <span class="b"
            :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em
      aria-hidden="true">/</em> <span
      :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
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
        <button class="btn" @click="switchSource" title="Switch"
                :class="{ on: playing_index === 1, spin: playing_index === 1 }">
          <i class="iconfont">&#xe66d;</i>
        </button>
        <button class="btn" title="Loop" @click="toggle_loop" :class="{ on: looping }">
          <i class="iconfont">&#xe66e;</i>
        </button>
      </div>
    </div>
    <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @input="onRangeInput"
           @change="onRangeChange" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown"/>
    </div>
  `,
  computed: {},
  mounted: function () {
    let _ = this
    _.audio_1 = new Howl({
      src: [
        _.on.src
      ]
    })
    
    _.audio_2 = new Howl({
      volume: 0,
      src: [
        _.off.src
      ]
    })
    
    let dataPath = _.on.src.replace('.mp3', '.json')
    axios.get(dataPath).then(res => {
      _.duration = res.data.format.duration
      _.canplayFun()
      _.instance_id = getTimeStamp()
      document.addEventListener('mouseup', function () {
        _.range_count = 0
      })
      document.addEventListener('touchend', function () {
        _.range_count = 0
      })
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
      let ct = _this.audio_1.seek()
      let du = _this.duration
      return (ct / du) * 100
    },
    canplayFun: function () {
      let _ = this
      _.audio_1.on('loaderror', function (err) {
        console.log(err)
      })
      
      setInterval(function () {
        if (_.adjust_progress_ready) {
          return false
        }
        _.percent = _.calcPercentage()
        _.currentTime = _.audio_1.seek()
      }, 100)
      
      _.audio_1.once('load', function () {
        _.duration = _.audio_1.duration(0)
      })
      
      _.audio_1.on('play', function () {
        _.playing = true
      })
      
      _.audio_1.on('end', function () {
        _.playing = false
        
        if (_.looping) {
          _.audio_1.play()
          _.audio_2.play()
        }
      })
      
      _.audio_1.on('stop', function () {
        _.playing = false
        _.looping = false
      })
      
      _.audio_1.volume(1, 0)
    },
    playFun: function (e) {
      e.preventDefault()
      let _ = this
      if (_.playing) {
        _.audio_1.pause()
        _.audio_2.pause()
      } else {
        _.audio_1.play()
        _.audio_2.play()
      }
    },
    stopAudio: function (e) {
      e.preventDefault()
      let _ = this
      if (_.playing_index === 0) {
        _.audio_1.fade(1, 0, _.fadeD)
      } else {
        _.audio_2.fade(1, 0, _.fadeD)
      }
      setTimeout(function () {
        _.audio_1.stop()
        _.audio_2.stop()
        if (_.playing_index === 0) {
          _.audio_1.volume(1)
        } else {
          _.audio_2.volume(1)
        }
      }, _.fadeD)
    },
    switchSource: function (spec) {
      let _ = this
      if (_.playing_index === 0) {
        _.audio_1.fade(1, 0, _.fadeD)
        _.audio_2.fade(0, 1, _.fadeD)
        _.playing_index = 1
      } else {
        _.audio_2.fade(1, 0, _.fadeD)
        _.audio_1.fade(0, 1, _.fadeD)
        _.playing_index = 0
      }
    },
    onRangeChange: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.audio_1.seek((_this.percent / 100) * _this.duration)
      _this.audio_2.seek((_this.percent / 100) * _this.duration)
      _this.currentTime = _this.audio_1.seek()
      _this.adjust_progress_ready = false
      _this.range_count = 0
    },
    onRangeInput: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.currentTime = (_this.percent / 100) * _this.duration
      _this.adjust_progress_ready = true
      _this.range_count++
    },
    rangeChangeDown: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = parseInt(range_input.value)
      _this.currentTime = _this.audio_1.seek()
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
      instance_id: null,
      range_count: 0,
      fadeD: 100
    }
  },
  watch: {}
}
