import {sec2time, getTimeStamp, getRandomInt, getDuration} from '../utils'

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
  <div class="spectrum">
    <div class="item-wrap">
        <div class="item" v-for="item in fDataSub" :style="{height: item / 255 * 90 + '%'}"></div>
      </div>
      <div class="item-wrap">
        <div class="item" v-for="item in fDataLow" :style="{height: item / 255 * 90 + '%'}"></div>
      </div>
      <div class="item-wrap">
        <div class="item" v-for="item in fDataHigh" :style="{height: item / 255 * 90 + '%'}"></div>
      </div>
      <div class="item-wrap">
        <div class="item" v-for="item in fDataSHigh" :style="{height: item / 255 * 90 + '%'}"></div>
      </div>
  </div>
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
      <button class="btn" @click="playFun" :title="!playing ? 'Paused, click to start playing audio' : 'started, click to pause audio'">
        <span class="material-symbols-rounded" v-if="!playing">
          play_arrow
        </span>
        <span class="material-symbols-rounded" v-if="playing">
          pause
        </span>
      </button>
      <button class="btn" @click="stopAudio" title="click to stop playing audio">
        <span class="material-symbols-rounded">
          stop
        </span>
      </button>
      <button class="btn" @click="switchSource" title="click to switch audio source" :class="{ on: playing_index == 1, spin: playing_index == 1 }">
        <span class="material-symbols-rounded">
          switch_left
        </span>
      </button>
      <button class="btn" :title="!looping ? 'Put audio on loop' : 'Currently on loop, click again to disable'" @click="toggle_loop" :class="{ on: looping }">
        <span class="material-symbols-rounded">
          all_inclusive
        </span>
      </button>
    </div>
  </div>
  <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @input="onRangeInput" @change="onRangeChange" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" :style="{ 'background-image': 'url(' + wave_img_src + ')' }" />
</div>
  `,
  computed: {
    fftSize() {
      let _ = this
      return Math.pow(2, _.fftSizeInPow)
    }
  },
  mounted: function () {
    let _this = this
    if (!_this.on) {
      return false
    }
    if (!_this.off) {
      return false
    }
    
    _this.initFreqData()
    _this.instance_id = '_' + getTimeStamp()
    
    _this.audio_1 = _this.$refs.audio_1
    _this.audio_2 = _this.$refs.audio_2
    _this.audio_2.volume = 0
    _this.getDuration(_this.audio_1.src, function (d) {
      _this.duration = d
      _this.canplayFun()
      _this.audio_1.addEventListener('pause', function () {
        _this.playing = false
      })
      _this.audio_1.addEventListener('play', function () {
        _this.playing = true
        _this.initSpectrum()
      })
      document.addEventListener('mouseup', function () {
        _this.range_count = 0
      })
      document.addEventListener('touchend', function () {
        _this.range_count = 0
      })
    })
  },
  methods: {
    sec2time: sec2time,
    getTimeStamp: getTimeStamp,
    getRandomInt: getRandomInt,
    getDuration: getDuration,
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
      _this.audio_ctx = _this.audio_ctx == null ? new (window.AudioContext || window.webAudioContext || window.webkitAudioContext)() : _this.audio_ctx
      
      _this.source_1 = _this.source_1 == null ? _this.audio_ctx.createMediaElementSource(_this.$refs.audio_1) : _this.source_1
      _this.source_2 = _this.source_2 == null ? _this.audio_ctx.createMediaElementSource(_this.$refs.audio_2) : _this.source_2
      
      _this.playing = !_this.playing
    },
    stopAudio: function (e) {
      e.preventDefault()
      let _this = this
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
      _this.percent = range_input.value
      _this.currentTime = (_this.percent / 100) * _this.duration
      _this.adjust_progress_ready = false
      _this.range_count++
    },
    switchSource: function (spec) {
      let _this = this
      let _off = function () {
        if (_this.playing_index == 1) {
          return false
        }
        _this.playing_index = 1
        _this.source_1.disconnect(_this.analyzer)
        _this.source_2.connect(_this.analyzer)
        _this.audio_1.volume = 0
        _this.audio_2.volume = 1
      }
      let _on = function () {
        if (_this.playing_index == 0) {
          return false
        }
        _this.playing_index = 0
        _this.source_2.disconnect(_this.analyzer)
        _this.source_1.connect(_this.analyzer)
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
      _this.percent = range_input.value
      _this.audio_1.currentTime = (_this.percent / 100) * _this.duration
      _this.audio_2.currentTime = _this.audio_1.currentTime
      _this.currentTime = _this.audio_1.currentTime
      _this.adjust_progress_ready = false
      _this.range_count = 0
    },
    rangeChangeDown: function () {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.audio_1.currentTime = (_this.percent / 100) * _this.duration
      _this.audio_2.currentTime = _this.audio_1.currentTime
      _this.currentTime = _this.audio_1.currentTime
      _this.adjust_progress_ready = true
    },
    initSpectrum: function () {
      let _ = this
      if (_.clickPlayCount > 0) {
        return false
      }
      _.clickPlayCount++
      let audioContext = _.audio_ctx
      let audioSrc = _.source_1
      _.analyzer = audioContext.createAnalyser()
      _.analyzer.fftSize = _.fftSize
      
      audioSrc.connect(_.analyzer)
      _.analyzer.connect(audioContext.destination)
      
      setInterval(() => {
        _.bufferLength = _.analyzer.frequencyBinCount
        let frequencyData = new Uint8Array(_.bufferLength)
        _.analyzer.getByteFrequencyData(frequencyData)
        _.fData = _.uint8ArrayToArray(frequencyData)
        _.frequencyResolver()
      }, 1000 / 60)
    },
    
    getArrMid(arr) {
      if (arr.length < 1) {
        return arr[0]
      }
      
      return arr[Math.floor(arr.length / 2)]
    },
    getArrAvg(arr) {
      let sum = 0
      arr.forEach(el => {
        sum += el
      })
      
      return (sum / arr.length).toFixed(0)
    },
    splitArray(arr, split) {
      let _ = this
      let chunk
      let chunkSize = Math.floor(arr.length / split)
      let splitArray = []
      
      while (arr.length > 0) {
        chunk = arr.splice(0, chunkSize)
        splitArray.push(chunk)
      }
      
      return splitArray
    },
    getBand(range, minSplitNumber) {
      let _ = this
      let data = _.fData
      
      let arr = []
      
      for (let i = 0; i < range[1] - range[0]; i++) {
        arr.push(data[i + range[0]])
      }
      
      let splitArr = _.splitArray(arr, minSplitNumber)
      let rArr = []
      
      for (let i = 0; i < splitArr.length; i++) {
        rArr.push(_.getArrMid(splitArr[i]))
      }
      
      return rArr
    },
    enhanceGraph(arr, ratio) {
      let newArr = arr.map(el => {
        return el * ratio > 255 ? 255 : el * ratio
      })
      
      return newArr
    },
    shrinkArr(arr, shrinkIndex) {
      if (arr.length < 2) {
        return arr
      }
      
      let temp = []
      for (let i = 0; i < arr.length; i++) {
        if (i % shrinkIndex === 0) {
          temp.push(arr[i])
        }
      }
      
      return temp
    },
    frequencyResolver() {
      let _ = this
      let analyzerRange = [10, 30000]
      let ar = analyzerRange[1] - analyzerRange[0]
      let subRatio = 90 / ar // [10, 100] 30%
      let lowRatio = 900 / ar // [100, 1000] 30%
      let highRatio = 9000 / ar // [1000, 10000] 30%
      let sHighRatio = 10000 / ar // [10000, 20000] 10%
      
      let dataCount = _.fftSize / 2
      let subCount = Math.floor(dataCount * subRatio)
      let lowCount = Math.floor(dataCount * lowRatio)
      let highCount = Math.floor(dataCount * highRatio)
      let sHighCount = Math.floor(dataCount - highCount - lowCount - subCount)
      
      let subRange = [0, subCount]
      let lowRange = [subCount + 1, lowCount]
      let highRange = [lowCount + 1, highCount]
      let sHighRange = [highCount + 1, sHighCount]
      
      _.fDataSub = _.shrinkArr(_.enhanceGraph(_.getBand(subRange, subCount), .8), 2)
      _.fDataLow = _.shrinkArr(_.enhanceGraph(_.getBand(lowRange, subCount), .9), 1)
      _.fDataHigh = _.shrinkArr(_.enhanceGraph(_.getBand(highRange, subCount), 1.2), 1)
      _.fDataSHigh = _.shrinkArr(_.enhanceGraph(_.getBand(sHighRange, subCount), 1.6), 8)
    },
    initFreqData: function () {
      let _ = this
      _.fDataSub = [0, 0]
      _.fDataLow = [0, 0, 0, 0]
      _.fDataHigh = [0, 0, 0]
      _.fDataSHigh = [0]
    },
    uint8ArrayToArray(uint8Array) {
      let array = []
      
      for (let i = 0; i < uint8Array.byteLength; i++) {
        array[i] = uint8Array[i]
      }
      
      return array
    }
  },
  data: function () {
    return {
      gainNode: null,
      gainNode_2: null,
      source_1: null,
      source_2: null,
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
      fade_time: 0.1,
      fData: null,
      fDataShrink: [],
      fDataSub: [],
      fDataLow: [],
      fDataHigh: [],
      fDataSHigh: [],
      fftSizeInPow: 11,
      bufferLength: 0,
      analyzer: null,
      clickPlayCount: 0
    }
  },
  watch: {
    playing: function (e) {
      let _this = this
      if (e) {
        _this.source_1.mediaElement.play()
        _this.source_2.mediaElement.play()
      } else {
        _this.source_1.mediaElement.pause()
        _this.source_2.mediaElement.pause()
      }
    }
  }
}
