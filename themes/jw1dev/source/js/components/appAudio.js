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
    let _ = this
    _.audio = new Howl({
      src: _.src
    })
    
    let dataPath = _.src.replace('.mp3', '.json')
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
    canplayFun: function () {
      let _ = this
      _.audio.on('loaderror', function (err) {
        console.log(err)
      })
      
      setInterval(function () {
        if(_.adjust_progress_ready){
          return false
        }
        _.percent = _.calcPercentage()
        _.currentTime = _.audio.seek()
      }, 100)
      
      _.audio.once('load', function () {
        _.duration = _.audio.duration()
      })
  
      _.audio.on('play', function () {
        _.playing = true
      })
  
      _.audio.on('pause', function () {
        _.playing = false
      })
  
      _.audio.on('end', function () {
        _.playing = false
        
        if(_.looping){
          _.audio.play()
        }
      })
  
      _.audio.on('stop', function () {
        _.playing = false
        _.looping = false
      })
    },
    handleClick: function (e) {
      let _ = this
      if(_.playing){
        _.audio.pause()
      }else{
        _.audio.play()
      }
    },
    calcPercentage: function () {
      let _this = this
      let ct = _this.audio.seek()
      let du = _this.duration
      return (ct / du) * 100
    },
    stopAudio: function (e) {
      let _ = this
      _.audio.fade(1, 0, _.fadeD)
      
      setTimeout(function () {
        _.audio.stop()
        _.audio.volume(1)
      }, _.fadeD)
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
      _this.audio.seek((_this.percent / 100) * _this.duration)
      _this.currentTime = _this.audio.seek()
      _this.range_count = 0
    },
    onRangeInput: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.currentTime = (_this.percent / 100) * _this.duration
      _this.adjust_progress_ready = true
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
      fadeD: 100,
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
  }
}
