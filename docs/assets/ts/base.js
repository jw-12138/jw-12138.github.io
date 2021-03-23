window.sec2time = function(s) {
  var pad = function(num, size) {
      return ('000' + num).slice(size * -1)
    },
    time = parseFloat(s).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60)

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2)
}

window.getRandomInt = function(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

window.getTimeStamp = function() {
  let ts = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now()
  ts = ts.toString()
  let ts_arr = ts.split('.')
  return ts_arr[0] + ts_arr[1]
}