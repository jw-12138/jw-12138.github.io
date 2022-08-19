export function sec2time(s) {
  if (s === Infinity) {
    return '00:00:00'
  }
  var pad = function (num, size) {
      return ('000' + num).slice(size * -1)
    },
    time = parseFloat(s).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60)
  
  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2)
}

export function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export function getTimeStamp() {
  let ts = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
  ts = ts.toString()
  let ts_arr = ts.split('.')
  return ts_arr[0] + ts_arr[1]
}

export function getDuration(url, next) {
  let _player = new Audio(url)
  _player.addEventListener('durationchange', function (e) {
    if (this.duration !== Infinity) {
      let duration = this.duration
      _player.remove()
      next(duration)
    } else {
      next(Infinity)
    }
    
  }, false)
  _player.load()
  _player.currentTime = 24 * 60 * 60
  _player.volume = 0
  _player.play()
}