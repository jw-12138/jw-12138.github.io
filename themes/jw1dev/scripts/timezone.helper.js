const moment = require('moment-timezone')
hexo.extend.helper.register('mmtz', function(date, format){
  let defaultFormat = 'YYYY-MM-DD'
  return moment(date).tz('Asia/Shanghai').format(format || defaultFormat)
})