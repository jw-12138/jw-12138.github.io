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
  template: '#temp_app_audio',
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
      }, 1000 / 30)
      
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
