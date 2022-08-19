import {sec2time, getTimeStamp, getRandomInt, getDuration} from "../utils";

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
  <div class="name">
    {{ label }}
  </div>
  <div class="time" title="This is the timing panel">
    <span class="b" :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em aria-hidden="true">/</em> <span :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
  </div>
  <div class="control" title="This is the control panel">
    <div class="btn-grp">
      <button class="btn" @click="handleClick" :title="!playing ? 'Paused, click to start playing audio' : 'started, click to pause audio'">
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
      <button v-if="hasloop" class="btn" :title="!looping ? 'Put audio on loop' : 'Currently on loop, click again to disable'" @click="toggle_loop" :class="{ on: looping }">
        <span class="material-symbols-rounded">
        all_inclusive
        </span>
      </button>
    </div>
  </div>
  <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @change="onRangeChange" @input="onRangeInput" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" />
</div>`,
  computed: {
    fftSize(){
      let _ = this
      return Math.pow(2, _.fftSizeInPow)
    }
  },
  mounted: function () {
    let _this = this
    let a = this.$refs.audio_ele
    _this.getDuration(a.src, function (d) {
      _this.duration = d
      _this.canplayFun(a)
      _this.instance_id = getTimeStamp()
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
    canplayFun: function (a) {
      let _this = this
      _this.initFreqData()
      _this.audio = a
      _this.percent = _this.calcPercentage()
      a.ontimeupdate = function () {
        if (!_this.adjust_progress_ready && _this.range_count === 0) {
          _this.percent = _this.calcPercentage()
          _this.currentTime = _this.audio.currentTime
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
        _this.initSpectrum()
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
    initSpectrum: function() {
      let _ = this
      if(_.clickPlayCount > 0) {
        return false
      }
      _.clickPlayCount++
      let audio = _.audio
    
      let audioContext = new AudioContext()
      let audioSrc = audioContext.createMediaElementSource(audio)
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
    
      _.fDataShrink = _.shrinkArr(_.fData, 128)
    },
    initFreqData: function(){
      let _ = this
      _.fDataSub = [0,0,]
      _.fDataLow = [0,0,0,0]
      _.fDataHigh = [0,0,0]
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
      fData: null,
      fDataShrink: [],
      fDataSub: [],
      fDataLow: [],
      fDataHigh: [],
      fDataSHigh: [],
      fftSizeInPow: 11,
      bufferLength: 0,
      analyzer: null,
      clickPlayCount: 0,
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
