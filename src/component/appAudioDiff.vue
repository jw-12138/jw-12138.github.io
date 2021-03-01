<template>
  <div class="app-audio-wrap" :class="{ playing: playing }">
    <audio :src="on.src" preload="metadata" ref="audio_1" :loop="looping"></audio>
    <audio :src="off.src" preload="metadata" ref="audio_2" :loop="looping"></audio>
    <div class="name bg" @click="switchSource('on')">
      <span class="icon" aria-hidden="true">
        <svg title="icon, playing" :style="{ display: playing_index == 0 ? 'block' : 'none' }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" /></svg>
      </span>
      <span :title="playing_index == 0 ? 'Currently on this track' : ''">
        {{ activeText }}
      </span>
    </div>
    <div class="name bg" @click="switchSource('off')">
      <span class="icon" aria-hidden="true">
        <svg title="icon, playing" :style="{ display: playing_index == 1 ? 'block' : 'none' }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" /></svg>
      </span>
      <span :title="playing_index == 1 ? 'Currently on this track' : ''">
        {{ inactiveText }}
      </span>
    </div>
    <div class="time" title="This is the timing panel">
      <span class="b" :title="'Currently on the ' + parseInt(currentTime) + ' second'">{{ sec2time(currentTime) }}</span> <em aria-hidden="true">/</em> <span :title="'This track has ' + parseInt(duration) + ' seconds'">{{ sec2time(duration) }}</span>
    </div>
    <div class="control" title="This is the control panel">
      <div class="btn-grp">
        <button class="btn" @click="playFun" :title="!playing ? 'Paused, click to start playing audio' : 'started, click to pause audio'">
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
        <button class="btn" @click="switchSource" title="click to switch audio source" :class="{ on: playing_index == 1, spin: playing_index == 1 }">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M9.01 14H3c-.55 0-1 .45-1 1s.45 1 1 1h6.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V14zm5.98-2.21V10H21c.55 0 1-.45 1-1s-.45-1-1-1h-6.01V6.21c0-.45-.54-.67-.85-.35l-2.78 2.79c-.19.2-.19.51 0 .71l2.78 2.79c.31.31.85.09.85-.36z" />
          </svg>
        </button>
        <button class="btn" :title="!looping ? 'Put audio on loop' : 'Currently on loop, click again to disable'" @click="toggle_loop" :class="{ on: looping }">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V18z" /></svg>
        </button>
      </div>
    </div>
    <input type="range" min="0" max="100" v-model="percent" :id="instance_id" @input="onRangeInput" @change="onRangeChange" title="Progress bar" @mousedown="rangeChangeDown" @touchstart="rangeChangeDown" :style="{ 'background-image': 'url(' + wave_img_src + ')' }" />
  </div>
</template>

<script>
import base from '../js/base'
import axios from 'axios'

export default {
  props: {
    on: {
      default: {}
    },
    off: {
      default: {}
    }
  },
  computed: {},
  mounted: function() {
    let _this = this
    if (!_this.on) {
      return false
    }
    if (!_this.off) {
      return false
    }

    _this.instance_id = '_' + _this.getTimeStamp()

    _this.audio_1 = _this.$refs.audio_1
    _this.audio_2 = _this.$refs.audio_2
    _this.audio_1.addEventListener('loadedmetadata', function() {
      _this.canplayFun()
    })
    _this.audio_1.addEventListener('pause', function() {
      _this.playing = false
    })
    _this.audio_1.addEventListener('play', function() {
      _this.playing = true
    })
    _this.hasWave(_this.on)
    document.addEventListener('mouseup', function() {
      _this.range_count = 0
    })
    document.addEventListener('touchend', function() {
      _this.range_count = 0
    })
  },
  methods: {
    hasWave: function(which) {
      let _this = this
      let url_arr = which.src.split('.')
      let url = url_arr[0] + '.png'
      axios({
        method: 'get',
        url: url
      })
        .then(function(res) {
          if (res.status == 200) {
            _this.wave_img = true
            _this.wave_img_src = url
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    toggle_loop: function(e) {
      e.preventDefault()
      this.looping = !this.looping
    },
    calcPercentage: function() {
      let _this = this
      let ct = _this.audio_1.currentTime
      let du = _this.audio_1.duration
      return (ct / du) * 100
    },
    canplayFun: function() {
      let _this = this
      _this.duration = _this.audio_1.duration
      _this.percent = _this.calcPercentage()
      _this.audio_1.ontimeupdate = function() {
        if (!_this.adjust_progress_ready && _this.range_count == 0) {
          _this.percent = _this.calcPercentage()
          _this.currentTime = _this.audio_1.currentTime
        }
      }
      _this.audio_1.onended = function() {
        _this.percent = 0
        _this.audio_1.currentTime = 0
        _this.audio_2.currentTime = 0
        _this.currentTime = 0
      }

      _this.audio_1.onpause = function() {
        _this.playing = false
      }

      _this.audio_1.onplay = function() {
        _this.playing = true
      }
    },
    playFun: function(e) {
      e.preventDefault()
      let _this = this
      _this.audio_ctx = _this.audio_ctx == null ? new (window.AudioContext || window.webAudioContext || window.webkitAudioContext)() : _this.audio_ctx
      _this.gainNode = _this.gainNode == null ? _this.audio_ctx.createGain() : _this.gainNode
      _this.gainNode_2 = _this.gainNode_2 == null ? _this.audio_ctx.createGain() : _this.gainNode_2

      if (_this.source_1 == null && _this.source_2 == null) {
        _this.gainNode.gain.value = 1
        _this.gainNode_2.gain.value = 0
      }

      _this.source_1 = _this.source_1 == null ? _this.audio_ctx.createMediaElementSource(_this.$refs.audio_1) : _this.source_1
      _this.source_2 = _this.source_2 == null ? _this.audio_ctx.createMediaElementSource(_this.$refs.audio_2) : _this.source_2

      _this.source_1.connect(_this.gainNode)
      _this.source_2.connect(_this.gainNode_2)
      _this.gainNode.connect(_this.audio_ctx.destination)
      _this.gainNode_2.connect(_this.audio_ctx.destination)

      _this.playing = !_this.playing
    },
    stopAudio: function(e) {
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
    onRangeInput: function() {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.currentTime = (_this.percent / 100) * _this.audio_1.duration
      _this.adjust_progress_ready = false
      _this.range_count++
    },
    switchSource: function(spec) {
      let _this = this
      let _off = function() {
        if (_this.playing_index == 1) {
          return false
        }
        _this.playing_index = 1
        _this.hasWave(_this.off)
        if (_this.gainNode) {
          _this.gainNode.gain.value = 0
          _this.gainNode_2.gain.value = 1
        }
      }
      let _on = function() {
        if (_this.playing_index == 0) {
          return false
        }
        _this.playing_index = 0
        _this.hasWave(_this.on)
        if (_this.gainNode) {
          _this.gainNode.gain.value = 1
          _this.gainNode_2.gain.value = 0
        }
      }

      if (typeof spec == 'string' && spec != '') {
        if (spec == 'on') {
          _on()
        } else {
          _off()
        }
        return false
      }

      if (_this.playing_index == 0) {
        _off()
      } else {
        _on()
      }
    },
    onRangeChange: function() {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.audio_1.currentTime = (_this.percent / 100) * _this.audio_1.duration
      _this.audio_2.currentTime = _this.audio_1.currentTime
      _this.currentTime = _this.audio_1.currentTime
      _this.adjust_progress_ready = false
      _this.range_count = 0
    },
    rangeChangeDown: function() {
      let _this = this
      let range_input = document.getElementById(_this.instance_id)
      _this.percent = range_input.value
      _this.audio_1.currentTime = (_this.percent / 100) * _this.audio_1.duration
      _this.audio_2.currentTime = _this.audio_1.currentTime
      _this.currentTime = _this.audio_1.currentTime
      _this.adjust_progress_ready = true
    }
  },
  data: function() {
    return {
      sec2time: base.sec2time,
      getRandomInt: base.getRandomInt,
      getTimeStamp: base.getTimeStamp,
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
      fade_time: 0.1
    }
  },
  watch: {
    playing: function(e) {
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
</script>
